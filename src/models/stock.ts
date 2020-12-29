import mongoose from 'mongoose';

export interface IStock extends mongoose.Document {
  longname: string,
  sector: string,
  symbol: string,
  yearHigh?: number,
  yearLow?: number,
  bid: number,
  ask: number,
}

const schema = mongoose.Schema;
const StockSchema = new schema({
    longname: {
      type: String,
      required: true
    },
    sector: {
      type: String,
      required: true
    },
    symbol: {
      type: String,
      required: true,
    },
    yearHigh: {
      type: Number,
      required: false
    },
    yearLow: {
      type: Number,
      required: false
    },
    bid: {
      type: Number,
      required: false
    },
    ask: {
      type: Number,
      required: false
    },
    watchlist: {
      type: schema.Types.ObjectId,
      ref: "Watchlist"
   }
  });

  export const Stock = mongoose.model<IStock>("stock-tickers", StockSchema);