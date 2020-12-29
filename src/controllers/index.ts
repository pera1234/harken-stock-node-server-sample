import logger from '../../logger';
import { IndexService } from './../services/index';

export class IndexController {
  indexService = new IndexService();

  public async getIndex(req: any, res: any) {
    logger.info(`Fetching index: ${req.params.name}`);
    const fetchedIndex = await this.indexService.getIndex(req.params.name);

    res.status(200).json(fetchedIndex);
  }

}
