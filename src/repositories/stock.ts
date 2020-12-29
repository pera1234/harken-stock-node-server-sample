import { IStock, Stock } from '../models/stock';
import { BaseRepository } from './base';

export class StockRepository extends BaseRepository<IStock> {
  
  async getStockBySymbol(symbol: string):  Promise<IStock | null> {
    return await Stock.findOne({ symbol });
  }

  async getStocks(limit: number):  Promise<IStock[] | null> {
    return await Stock.find({})
    .sort({ symbol: 1 })
    .limit(+limit);
  }

  async getPagination(query: any, start: number, end: number, sorter: any): Promise<IStock[] | null> {
    return await Stock.find(query).skip(start).limit(end).sort(sorter)
  }

  async getStockCount(query: any): Promise<number> {
    return await Stock.find(query).count();
  }

  async getStocksByQuery(query: any): Promise<IStock[] | null> {
    return await Stock.find(query).exec();
  }

  async updateStock(query: any, update: any, options: any) {
    return await Stock.findOneAndUpdate(query, update, options); // todo not working { $set: stock }
  }

  async getDistinctStock(field: string): Promise<any[] | null> {
    return await Stock.distinct(field);
  }

  async insertManyStocks(stocks: IStock[]): Promise<void> {
    await Stock.insertMany(stocks);
  }
}
