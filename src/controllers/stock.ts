import logger from '../../logger';
import { Stock } from '../models/stock';
import { StockRepository } from '../repositories/stock';
import { StockService } from '../services/stock';

export interface GridParams {
  startRow: number,
  endRow: number,
  sortModel: {colId: string, sort: string}[],
  filterModel: any
};

export class StockController {
  stockService = new StockService(new StockRepository());

  public async getStock(req: any, res: any) {
    logger.info(`Fetching stock: ${req.params.symbol}`);
    const fetchedStock = await this.stockService.getStockBySymbol(req.params.symbol);

    logger.info(fetchedStock);
    res.status(200).json({ stocks: fetchedStock });
  }

  public async getStocks(req: any, res: any) {
    logger.info('Fetching stocks:');
    const limit: number = +req.query.limit;
    const fetchedStocks = await this.stockService.getStocks(limit);

    res.status(200).json(fetchedStocks );
  }

  public async addStock(req: any, res: any) {
    logger.info(`Adding stock: ${req.params.symbol}`);
  }

  public async deleteStock(req: any, res: any) {
    logger.info(`Deleting stock: ${req.params.symbol}`);
  }

  public async createStock(req: any, res: any) {
    const stock = new Stock({
      longname: req.body.longname,
      sector: req.body.sector,
      symbol: req.body.symbol,
      bid: req.body.bid,
      ask: req.body.ask,
    });

    const result = await this.stockService.createStock(stock)
    .catch((err) => {
      logger.info(err);
    });

    logger.info(`Stock created: ${result}`);
    res.status(200).json({ stocks: result });
  }

  public async loadStockTickers(req: any, res: any) {
    logger.info('Loading stock tickers:');
    this.stockService.loadStockFile()
    res.status(200).json({ message: 'Stocks loaded successfully' });
  }

  public async getStockGrid(req: any, res: any) {
    const gridParams: GridParams = {
      startRow: req.body.startRow,
      endRow: req.body.endRow,
      sortModel: req.body.sortModel,
      filterModel: req.body.filterModel
    };

    const result = await this.stockService.getPaginatedStocks(gridParams)
    .catch((error) => {
      logger.info(error);
    });

    res.status(200).json(result);
  }

  public async getActivity(req: any, res: any) {
    logger.info('Fetching sector activity:');
    const fetchedActivity = await this.stockService.getActivity();

    res.status(200).json(fetchedActivity);
  }

  public async getStockChart(req: any, res: any) {
    logger.info(`Fetching stock chart: ${req.body.symbols}`);
    const fetchedChart = await this.stockService.getStockChart(req.body.symbols);

    res.status(200).json(fetchedChart);
  }
}
