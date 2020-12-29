import logger from '../../logger';
import { WatchListRepository } from '../repositories/watchlist';
import { WatchListDataService } from '../services/watchlist';

export class WatchListController {
  watchListService = new WatchListDataService(new WatchListRepository());

  public async getWatchLists(req: any, res: any) {
    logger.info('Fetching watchlists:');
    const fetchedWatchlists = await this.watchListService.getWatchlists();

    logger.info(fetchedWatchlists);
    res.status(200).json({ watchlists: fetchedWatchlists });
  }

  public async addWatchList(req: any, res: any) {
    logger.info('Add watchlist:');

    const watchList = req.body;
    const updateResult = await this.watchListService.addWatchlist(watchList);
    res.status(200).json(updateResult);
  }

  public async updateWatchList(req: any, res: any) {
    const watchList = req.body;
    return await this.watchListService.updateWatchlist(watchList);
  }

  public async deleteWatchList(req: any, res: any) {
    const id = req.params.id;
    return await this.watchListService.deleteWatchlist(id);
  }

}
