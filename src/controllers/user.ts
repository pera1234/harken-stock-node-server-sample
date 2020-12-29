import logger from '../../logger';
import bcrypt from 'bcryptjs';
import { format } from 'date-fns';
import { UserService } from '../services/user';
import { AuthService } from '../services/auth';
import { UserRepository } from '../repositories/user';
import { IUser } from '../models/user';
import { RuntimeError } from '../errors/runtime-error';
import { ErrorCode } from '../errors/error-code';

/**
 * Uses simple DI to inject the auth service for token processing
 * TODO: investigate DI frameworks - typedi, awilix, nest, inversify
 */
export class UserController {
  private readonly DATE_FORMATTER = 'dd.MM.yyyy hh:mm:ss:SSS';

  userService = new UserService(
    new AuthService(),
    new UserRepository()
  );

  public async register(req: any, res: any) {
    logger.info(`Registering user: ${req.body.email}`);
    const email = req.body.email;
    const fetchedUser = await this.userService.getUser(email);

    if (fetchedUser) {
      res.status(400).json({ id: 'USER_EXISTS' });
    } else {
      const user = await this.userService.createUser(req);
      res.status(201).json({ id: 'USER_CREATED', payload: user });
    }
  }

  public async login(req: any, res: any) {
    logger.info(`User authenticating: ${req.body.email}`);
    const email = req.body.email;
    const fetchedUser = await this.userService.getUser(email);

    if (!fetchedUser) {
      throw new RuntimeError(ErrorCode.USER_NOT_FOUND, '401');
    }

    const isPasswordValid = await bcrypt.compare(req.body.password, fetchedUser.password);
    if (!isPasswordValid) {
      throw new RuntimeError(ErrorCode.PASSWORD_INVALID, '401');
    }

    const token = this.userService.createToken(fetchedUser);
    const dateFormatted = format(fetchedUser.updatedAt, this.DATE_FORMATTER);

    logger.info(`User authenticated: ${fetchedUser}, last updated: ${dateFormatted}`);
    res.status(200).json({
      token,
      expiresIn: process.env.JWT_EXPIRATION,
      userId: fetchedUser._id
    });
  }

  public async getUser(req: any, res: any) {
    logger.info(`Fetching user data: ${req.params.id}`);
    const id = req.params.id;
    const fetchedUser = await this.userService.getUserById(id);

    if (!fetchedUser) {
      return res.status(401).json({ message: 'User account not found' });
    }

    res.status(200).json(
      {'user': fetchedUser }
    );
  }

  public async update(req: any, res: any) : Promise<IUser| RuntimeError> {
    const id = req.body._id;
    logger.info(`Updating user profile: ${id}`);
    return await this.userService.updateUser(req);
  }

  public async userCheck(req: any, res: any) {
    const email = req.body.email;
    logger.info(`Checking username: ${email}`);

    const fetchedUser = await this.userService.getUser(email);

    if (fetchedUser) {
      return res.status(200).json(
        { code: 'USER_EXISTS' }
      );
    }

    res.status(200).json(
      { code: 'USER_NOT_EXISTS' }
    );
  }
}
