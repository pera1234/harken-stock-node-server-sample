import logger from '../../logger';
import { ErrorCode } from '../errors/error-code';
import { RuntimeError } from '../errors/runtime-error';
import { Stock } from '../models/stock';
import { User } from '../models/user';
import { IWatchList, WatchList } from '../models/watchlist';
import { BaseRepository } from './base';

export class WatchListRepository extends BaseRepository<IWatchList> {
  async getWatchLists(): Promise<IWatchList[] | null> {
    return await this.findAll(WatchList);
  }

  async addWatchList(watchlist: IWatchList): Promise<IWatchList | null | undefined> {
    return WatchList.create(watchlist).then(async wl => {
      const user = await User.findOneAndUpdate(
        { _id: watchlist.userid },
        {
          $push: { watchlists: wl._id },
        },
        { new: true },
      ).populate({
        path: 'watchlists',
        model: WatchList,
        populate: {
          path: 'stocks',
          model: Stock,
        },
        options: { sort: { name: 1 } },
      });
      return wl; // user?.watchlists;
    });
  }

  async updateWatchList(watchlist: IWatchList): Promise<IWatchList | null | undefined> {
    const query = { _id: watchlist._id };
    const update = { stocks: watchlist.stocks };
    const options = { upsert: true, new: true, useFindAndModify: false };

    return await WatchList.findOneAndUpdate(query, update, options).catch(() => {
      throw new RuntimeError(ErrorCode.DB_CONNECT_FAIL, '500');
    });;
  }

  async deleteWatchList(id: string): Promise<IWatchList | null | undefined> {
    return await WatchList.findOneAndDelete({ _id: id }).catch(() => {
      throw new RuntimeError(ErrorCode.DB_CONNECT_FAIL, '500');
    });;
  }
}
