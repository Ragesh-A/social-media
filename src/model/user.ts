import { Schema, model, connect } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  password: string;
  avatar: string;
  backgroundImg: string;
  isBlocked: boolean;
  isVerified: boolean;
  role: string;
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
    trim: true
  },
  backgroundImg: {
    type: String,
    required: true,
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
  role: {
    type: String,
    enum: ['user', 'admin'],
    required: true,
    default: 'user'
  }
}, { timestamps: true })

export default model<IUser>('User', userSchema)