import mongoose, { Schema, model } from "mongoose";
import { IUser } from "./user";

export interface ICategory {
  name: string,
  image: string,
  _id: string;
  createdBy: string | IUser;
}

export interface ISubCategory extends ICategory {
  category: ICategory;
}

const categorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    trim: true,
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

const subCategorySchema = new Schema<ISubCategory>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    trim: true,
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: mongoose.Types.ObjectId,
    ref: 'Category',
    required: true
  }

}, { timestamps: true})

export const CategoryModel = model<ICategory>('Category', categorySchema);
export const SubCategoryModel = model<ISubCategory>('SubCategory', subCategorySchema);
