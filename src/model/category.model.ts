import mongoose, { Schema, model } from "mongoose";
import { IUser } from "./user";

export interface ICategory {
  name: string,
  image: string,
  _id: string;
  createdBy: string | IUser;
  isListed: boolean;
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
    required: true,
    select: false
  },
  isListed: { type: Boolean, default: true, select: false }
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
    required: true,
    select: false
  },
  category: {
    type: mongoose.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  isListed: { type: Boolean, default: true, select: false }

}, { timestamps: true })

export const CategoryModel = model<ICategory>('Category', categorySchema);
export const SubCategoryModel = model<ISubCategory>('SubCategory', subCategorySchema);
