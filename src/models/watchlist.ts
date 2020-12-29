import mongoose from 'mongoose';
import logger from '../../logger';
import { User } from './user';

export interface IWatchList extends mongoose.Document {
  name: string,
  sector: string,
  stocks?: [],
  userid: string
}

const schema = mongoose.Schema;
const WatchlistSchema = new schema({
    name: {
      type: String,
      required: true
    },
    sector: {
      type: String,
      required: false
    },
    stocks: [{
      type: schema.Types.ObjectId,
      ref: "Stock"
   }],
    userid: {
      type: schema.Types.ObjectId,
      ref: "User"
   }
  });

  WatchlistSchema.post('findOneAndDelete', async (wl: IWatchList) => {
    if (wl) {
      await User.findOneAndUpdate(
        { _id: wl.userid },
        {
          $pull: { watchlists: wl._id },
        },
        {
          new: true,
          useFindAndModify: false
        }
      );
    }
  });

  export const WatchList = mongoose.model<IWatchList>("stock-watchlists", WatchlistSchema);