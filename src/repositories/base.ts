import mongoose, { Document } from 'mongoose';

export abstract class BaseRepository<T extends Document> {

  findOne(model: mongoose.Model<T>, query: any) {
    return model.findOne(query);
  }

  findById(model: mongoose.Model<T>, id: string) {
    return model.findById(id);
  }

  findAll(model: mongoose.Model<T>) {
    return model.find({});
  }

  save(model: T) {
    return model.save();
  }

}
