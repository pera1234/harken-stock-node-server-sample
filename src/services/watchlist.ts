import logger from '../../logger';
import { WatchList, IWatchList } from '../models/watchlist';
import { WatchListRepository } from '../repositories/watchlist';

export class WatchListDataService {
  private _watchListRepository!: WatchListRepository;

  constructor(watchListRepository: WatchListRepository) {
    this._watchListRepository = watchListRepository;
  }

  async getWatchlists(): Promise<IWatchList[] | null | undefined> {
    return await this._watchListRepository.getWatchLists();
  }

  async addWatchlist(watchlist: IWatchList): Promise<IWatchList | null | undefined> {
    logger.info(`Adding watchlist for user: ${watchlist.userid}`);

    return await this._watchListRepository.addWatchList(watchlist);
  }

  async updateWatchlist(watchlist: IWatchList): Promise<IWatchList | null | undefined> {
    logger.info(`Updating watchlist for user: ${watchlist.userid}`);
    return await this._watchListRepository.updateWatchList(watchlist);
  }

  async deleteWatchlist(id: string): Promise<IWatchList | null | undefined> {
    logger.info(`Deleting watchlist: ${id}`);
    return await this._watchListRepository.deleteWatchList(id);
  }

}
