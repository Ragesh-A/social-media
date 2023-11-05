import { Schema, model, connect } from 'mongoose';

interface IUser {
  name: string;
  email: string;
  password: string;
  avatar: string;
  isBlocked: boolean;
  isVerified: boolean;
  isAdmin: boolean;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true,
    min: 5,
    max: 20,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    trim: true,
    select: false
  },
  avatar: {
    type: String,
    required: true,
    default: 'user.png',
    trim: true
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true })

export default model<IUser>('User', userSchema)