import logger from '../../logger';
import { RuntimeError } from '../errors/runtime-error';
import { AdminService } from '../services/admin';

export class AdminController {
  adminService = new AdminService();

  public async getDbStatus(req: any, res: any): Promise<any | RuntimeError> {
    logger.info(`Fetching db status:`);
    return await this.adminService.getDbStatus();
  }

}
