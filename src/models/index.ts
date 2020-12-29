import mongoose from 'mongoose';

export interface IHistory {
  timestamp: number;
  price: number;
}

export interface IIndex extends mongoose.Document {
  name: string,
  history: IHistory[],
}

const IndexSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    history: [{
      timestamp: Number,
      price: Number
    }]
  });

  export const Index = mongoose.model<IIndex>("stock-indices", IndexSchema);