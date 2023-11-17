import mongoose, { Schema, ObjectId, model } from "mongoose";
import { IUser } from "./user";
import { ISubCategory } from "./category.model";
import { IComment } from "./comment.model";

export interface IPost {
  creator: IUser;
  caption: string;
  isImage: boolean;
  url: string;
  likes: IUser[];
  tags: ISubCategory[];
  comments: IComment;
  location: string;
  views: ObjectId[]
}

const postSchema = new Schema<IPost>({
  creator: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  likes: [{
    type: mongoose.Types.ObjectId,
    ref: 'User'
  }],
  caption: {
    type: String,
    required: true,
  },
  tags: [{
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'SubCategory'
  }],
  views: [{
    type: mongoose.Types.ObjectId,
    ref: 'User'
  }],
  isImage: {
    type: Boolean,
    required: true,
    default: true
  },
  url: {
    type: String,
    trim: true,
    required: true
  },
  location: {
    type: String,
    trim: true,
  },
  comments: {
    type: mongoose.Types.ObjectId,
    ref: 'Comment'
  }
}, { timestamps: true })

export default model<IPost>('Post', postSchema);
