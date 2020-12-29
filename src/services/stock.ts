import { isAfter, isWeekend, subDays, subYears } from 'date-fns';
import { promises as fs } from 'fs';
import path from 'path';
import logger from '../../logger';
import { GridParams } from '../controllers/stock';
import { IStock, Stock } from '../models/stock';
import { StockRepository } from '../repositories/stock';

interface FilterModel {
  [key: string]: FilterQuery;
}

interface FilterQuery {
    filterType: string;
    type: string;
    filter: string;
}

interface SearchQuery {
  [key: string]: RegExp;
}

interface StockPriceHistory {
  name: string,
  data: number[][]
}

export class StockService {
  private _stockRepository!: StockRepository;

  constructor(stockRepository: StockRepository) {
    this._stockRepository = stockRepository;
  }

  async getStockBySymbol(symbol: string) {
    return await this._stockRepository.getStockBySymbol(symbol);
  }

  async getStocks(limit: number) {
    return await this._stockRepository.getStocks(limit);
  }

  async getPaginatedStocks(params: GridParams) {
    const sortQuery = Object.fromEntries(params.sortModel.map(({ colId, sort }) => [colId, sort]));
    const sorter = params.sortModel.length ? sortQuery : { longname: 'asc' };
    const query: SearchQuery = {};

    if (Object.keys(params.filterModel).length) {
      const filterModel: FilterModel = params.filterModel;

      Object.entries(filterModel).forEach(([key, value], index) => {
        logger.info(`${index}: ${key} =` + JSON.stringify(value));
        const field: string = Object.keys(filterModel)[index];
        const filter = filterModel[field].filter;
        const regexp = new RegExp('^' + filter, 'i');

        query[field] = regexp;
      });
    }
    logger.info('Filter search query:' + JSON.stringify(Object.keys(query)) + ',' + Object.values(query));

    const start:number = params.startRow;
    const end:number = params.endRow;

    const rows = await this._stockRepository.getPagination(query, start, end, sorter);

    const totalCount = await this._stockRepository.getStockCount(query);

    return { rows, totalCount };
  }

  async createStock(stock: IStock) {
    const query = { symbol: stock.symbol };
    const update = { longname: stock.longname, sector: stock.sector, bid: stock.bid, ask: stock.ask };
    const options = { upsert: true, new: true, useFindAndModify: false };

    return await this._stockRepository.updateStock(query, update, options);
  }

  /**
   * Populate from volumes table - { stock : volume } join { stock : sector }
   */
  async getActivity(): Promise<{ name: string; y: number }[]> {
    return await Stock.distinct('sector')
    .exec()
      .then((result: any[]) => {
        // create sector object expected by client - highcharts pie data - {name : y} - where y = %
        const activity: { name: string; y: number }[] = [];

        const tradedVolumes: { sector: string; volume: number }[] = []; // SectorActivity model
        result.forEach(sector => {
          const tradedVolume = {
            sector,
            volume: this.randomVolume(),
          };
          tradedVolumes.push(tradedVolume);
        });

        const volumes = tradedVolumes.map(it => it.volume);
        const totalVolume = volumes.reduce((total, volume) => total + volume, 0);

        tradedVolumes.forEach(sector => {
          const sectorByVolumePercent = {
            name: sector.sector,
            y: +((sector.volume * 100) / totalVolume).toFixed(2),
          };
          activity.push(sectorByVolumePercent);
        });

        return activity;
      });
  }

  randomVolume(): number {
    return Math.floor(Math.random() * (100000 - 20000 + 1)) + 20000;
  }

  /**
   * Create a 1 year price history for the stock using the yearHigh/Low range
   * @param symbol
   */
  async getStockChart(symbols: string[]): Promise<StockPriceHistory[] | void> {
    // currently the grid allows only a single collection - only take first item
    return await this._stockRepository.getStocksByQuery({ symbol: { $in: symbols }}).then((result: any) => {
      const priceHistories: StockPriceHistory[] = [];

      result.forEach((stock: any) => {
        const priceHistorySeries: number[][] = [];
        const yearHigh = stock!.yearHigh;
        const yearLow = stock!.yearLow;

        let yesterday = subDays(new Date(), 1);
        const yesterdayMinus1Y = subYears(yesterday, 1);

        while (isAfter(yesterday, yesterdayMinus1Y)) {
          const price = Math.floor(Math.random() * (yearHigh! - yearLow! + 1)) + yearLow!;

          const plotPoint: number[] = [];
          plotPoint.push(yesterday.getTime());
          plotPoint.push(price);
          priceHistorySeries.push(plotPoint);

          do {
            yesterday = subDays(yesterday, 1);
          } while (isWeekend(yesterday));
        }

        // randomly add the yearHigh/Low to series
        const highRandomIndex = Math.floor(Math.random() * priceHistorySeries.length);
        priceHistorySeries[highRandomIndex] = [priceHistorySeries[highRandomIndex][0],yearHigh!];
        const lowRandomIndex = Math.floor(Math.random() * priceHistorySeries.length);
        priceHistorySeries[lowRandomIndex] = [priceHistorySeries[lowRandomIndex][0],yearLow!];

        /** Highcharts expect point series to be pre-sorted asc
         *  Here first column is timestamp
         */
        priceHistorySeries.sort((a, b) => a[0] - b[0]);

        const stockPriceHistory:  StockPriceHistory = {
          name: stock!.symbol,
          data: priceHistorySeries
        }

        priceHistories.push(stockPriceHistory);
      });

      return priceHistories;
    }).catch((error) => {
      logger.error(error);
    });
  }

  /**
   * Load stocks into the database
   * This is uses async/await for asychronously reading stock data and updating db, rather
   * than traditional promises
   */
  async loadStockFile() {
    const stockFilePath = path.join(__dirname, process.env.STOCK_FILE_PATH!);

    const file = await fs.readFile(stockFilePath, 'utf8');
    const stocksJsonObj = JSON.parse(file);
    this.bulkLoadStocks(stocksJsonObj);

    const stocksJson = JSON.stringify(stocksJsonObj, null, 2);
    logger.info(stocksJson);
  }

  async bulkLoadStocks(stocks: IStock[]) {
    logger.info('Load stocks into store');
    const dropCollection = await Stock.collection.drop().catch(error => {
      logger.warn('Clearing existing stocks data caused: ' + error);
    });
    await this._stockRepository.insertManyStocks(stocks);
    logger.info('Stock load complete');
  }
}
