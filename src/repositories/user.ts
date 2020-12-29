import { ErrorCode } from '../errors/error-code';
import { RuntimeError } from '../errors/runtime-error';
import { Stock } from '../models/stock';
import { IUser, User } from '../models/user';
import { WatchList } from '../models/watchlist';
import { BaseRepository } from '../repositories/base';

export class UserRepository extends BaseRepository<IUser> {

  async getUserByEmail(email: string) : Promise<IUser | null> {
    return await this.findOne(User, { email }).populate({ path: 'watchlists', model: WatchList })
    .catch(() => {
      throw new RuntimeError(ErrorCode.DB_CONNECT_FAIL, '500');
    });
  }

  async getUserById(id: string): Promise<IUser | null> {
    const user = await this.findById(User, id).populate({
      path: 'watchlists',
      model: WatchList,
      populate: {
        path: 'stocks',
        model: Stock,
      },
      options: { sort: { name: 1 } },
    });

    return user;
  }

  async saveUser(model: IUser) {
    await this.save(model).catch(() => {
      throw new RuntimeError(ErrorCode.DB_CONNECT_FAIL, '500');
    });
  }

  async updateUser(model: IUser) : Promise<IUser| RuntimeError> {
    const query = { _id: model._id };
    const update = { firstname: model.firstname, lastname: model.lastname, dob: model.dob, phone: model.phone };
    const options = { upsert: false, new: true, useFindAndModify: false };

      return await User.findOneAndUpdate(query, update, options).catch(() => {
        throw new RuntimeError(ErrorCode.DB_CONNECT_FAIL);
      });
  }

}
