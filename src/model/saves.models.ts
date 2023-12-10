import mongoose from "mongoose";

export interface ISaves{
  user: mongoose.Types.ObjectId,
  post: mongoose.Types.ObjectId[]
}

const saveSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  post: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Post'
  }
})

export default mongoose.model<ISaves>('Saves', saveSchema);
