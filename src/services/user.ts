import logger from '../../logger';
import { User, IUser } from '../models/user';
import { WatchList } from '../models/watchlist';
import { AuthService } from './auth';
import { UserRepository } from '../repositories/user';
import { RuntimeError } from '../errors/runtime-error';
export class UserService {

  private _authService!: AuthService;
  private _userRepository!: UserRepository;

  constructor(authService: AuthService, userRepository: UserRepository) {
    this._authService = authService;
    this._userRepository = userRepository;
  }

  async getUser(email: string): Promise<IUser | null> {
    return this._userRepository.getUserByEmail(email);
  }

  async getUserById(id: string): Promise<IUser | null> {
    return this._userRepository.getUserById(id);
  }

  async createUser(req: any) : Promise<IUser> {
    const { firstname, lastname, dob, email, password } = req.body;

    const user = new User({
      firstname,
      lastname,
      dob,
      email,
      password,
    });

    this._userRepository.saveUser(user);

    return user;
  }

  async updateUser(req: any) : Promise<IUser| RuntimeError> {
    const { _id, firstname, lastname, dob, phone, email, password } = req.body;

    const user = new User({
      _id,
      firstname,
      lastname,
      dob,
      phone,
      email,
      password,
    });

    return this._userRepository.updateUser(user);
  }

  createToken(user: IUser) {
    return this._authService.createToken(user);
  }

}
