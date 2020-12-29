import { ErrorCode } from '../errors/error-code';
import { RuntimeError } from '../errors/runtime-error';
import { Admin } from '../models/admin';

export class AdminService {

  async getDbStatus(): Promise<any | RuntimeError>  {
   return await Admin.findOne({}).catch(() => {
    throw new RuntimeError(ErrorCode.DB_CONNECT_FAIL, '500');
  });
  }

}
