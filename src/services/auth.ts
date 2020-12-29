import logger from '../../logger';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/user';
import { ErrorCode } from '../errors/error-code';
import { RuntimeError } from '../errors/runtime-error';

export class AuthService {

  public async verifyToken(req: any, res: any, next: any): Promise<string | object> {
    const authorizationHeader = req.headers.authorization;
    let token: string = '';

    logger.info(`Verifying token: ${authorizationHeader}`);
    try {
        token = authorizationHeader.split(' ')[1];
        return jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      logger.error(`Token verify error: ${error.name}`);
      if ('TokenExpiredError' === error.name) {
        throw new RuntimeError(ErrorCode.TOKEN_EXPIRED, '500');
      }
      throw new RuntimeError(ErrorCode.TOKEN_VERIFY_FAILED, '500');
    }
  }

  public createToken(user: IUser) {
    logger.info(`Signing token for user: ${user.email}`);
    return jwt.sign({ email: user.email, userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRATION,
    });
  }
}
