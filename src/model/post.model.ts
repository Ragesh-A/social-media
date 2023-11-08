import { boolean } from "joi";
import mongoose, {Schema, ObjectId, model} from "mongoose";

export interface IPost{
  creator: ObjectId;
  likes: ObjectId;
  caption: string;
  tags: string[];
  isImage: boolean;
  url: string;
  location: string;
}

const postSchema = new Schema<IPost>({
  creator: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  likes: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  caption: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
  },
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
}, { timestamps: true })

export default model<IPost>('Post', postSchema);
 