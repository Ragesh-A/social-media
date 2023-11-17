import mongoose from "mongoose";
import { IUser } from "./user";
import { IPost } from "./post.model";

export interface IComment {
  comments: {
    content: string;
    user: IUser;
  }
  post: IPost;
}

const commentSchema = new mongoose.Schema<IComment>({
  post: { type: mongoose.Types.ObjectId, ref: 'Post' },
  comments: {
    content: { type: String, required: true, trim: true },
    user: { type: mongoose.Types.ObjectId, ref: 'User' },
  }
}, { timestamps: true })

export default mongoose.model<IComment>('Comment', commentSchema)