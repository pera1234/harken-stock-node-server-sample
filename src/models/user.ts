import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends mongoose.Document {
  firstname: string,
  lastname: string,
  dob: string,
  phone: number,
  email: string,
  password: string,
  watchlists: [],
  createdAt: Date,
  updatedAt: Date
}

const schema = mongoose.Schema;
const UserSchema = new schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: false,
  },
  dob: {
    type: String,
    required: false,
  },
  phone: {
    type: Number,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  watchlists: [
    {
      type: schema.Types.ObjectId,
      ref: 'Watchlist',
    },
  ],
},
{
  timestamps: true
});

UserSchema.pre<IUser>('save', encryptPassword);

async function encryptPassword(this: any) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
}

export const User = mongoose.model<IUser>('stock-users', UserSchema);
