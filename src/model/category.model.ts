import { Schema, model } from "mongoose";

export interface ICategory {
  name: string,
  image: string,
  subCategory: any
}


const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  subCategory: [{
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    }
  }],
  image: {
    type: String,
    trim: true,
  }
})

export default model('Category', categorySchema);