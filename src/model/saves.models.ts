import mongoose from "mongoose";

export interface ISaves{
  user: mongoose.Types.ObjectId,
  posts: mongoose.Types.ObjectId[]
}

const saveSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  posts: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User'
  }
})

export default mongoose.model<ISaves>('Saves', saveSchema);
