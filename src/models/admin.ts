import mongoose from 'mongoose';

export interface IAdmin extends mongoose.Document {
  name: string,
}

const AdminSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    }
  });

  export const Admin = mongoose.model<IAdmin>("stock-admin", AdminSchema);