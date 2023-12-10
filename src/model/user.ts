import mongoose, { Schema, model, ObjectId } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  password: string;
  avatar: string;
  backgroundImg: string;
  isBlocked: boolean;
  isVerified: boolean;
  role: string;
  bio: string;
  followersCount: number
  followingCount: number
  postsCount: number;
  likesCount: number
}

export interface IFollowings {
  user: IUser,
  followings: IUser[]
}

export interface IFollowers {
  user: IUser,
  follower: ObjectId
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
    unique: true,
    select: false
  },
  password: {
    type: String,
    required: true,
    trim: true,
    select: false
  },
  bio: { type: String },
  avatar: { type: String },
  backgroundImg: {
    type: String,
    trim: true
  },
  isBlocked: { type: Boolean, default: false, select: false },
  isVerified: { type: Boolean, default: false, select: false },
  role: {
    type: String,
    enum: ['user', 'admin'],
    required: true,
    default: 'user',
    select: false
  },
  followersCount: { type: Number, default: 0 },
  followingCount: { type: Number, default: 0 },
  postsCount: { type: Number, default: 0 },
  likesCount: { type: Number, default: 0 },

}, { timestamps: true })

const followersSchema = new Schema<IFollowers>({
  user: { type: mongoose.Types.ObjectId, ref: 'User' },
  follower: { type: mongoose.Types.ObjectId, ref: 'User' }
})


export const followers = model<IFollowers>('Followers', followersSchema);
export default model<IUser>('User', userSchema);
