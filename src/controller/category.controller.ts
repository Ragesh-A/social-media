import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../helper/catchAsync";
import categoryService from "../service/category.service";
import { ValidationError } from "joi";
import categorySchema from "../helper/validator/schema/categorySchema";
import { LoggedUserRequest } from "../types/request";


const createCategory = catchAsync(async (req: LoggedUserRequest, res: Response, next: NextFunction) => {
  const { error, value }:
    {
      error: ValidationError | undefined,
      value: ICategory
    } = categorySchema.validate(req.body);
  const userId = req.userId;
  if(!userId) throw { status: 400, message: 'User not found' }
  if (error) return next(error)
  const category = await categoryService.createCategory(value, userId);
  
  res.status(200).json({
    status: 200,
    success: true,
    message: `${category.name} successfully completed`,
    data: category,
  })
})

const updateCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

})

const findAllCategories = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const page = req.query.page || 1
  const categories = await categoryService.findAllCategories(Number(page))
  
  res.status(200).json({
    status: 200,
    success: true,
    message: 'Quiring successfully completed.',
    data: categories,
  })
})

const findCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const categoryId = req.params.categoryId
  const category:any = await categoryService.findCategory(categoryId);

res.status(200).json({
    status: 200,
    success: true,
    message: `${category?.name} successfully fetched.`,
    data: category,
  })
})

const createSubCategory = catchAsync(async (req: LoggedUserRequest, res: Response, next: NextFunction) => {
  const categoryId = req.params.categoryId
  const userId = req.userId ||''
  const { error, value }
  : {error: ValidationError | undefined, value: ICategory}  = categorySchema.validate(req.body);
  if (error) throw { status: 400, message: error };
  const subCategory = await categoryService.createSubCategory({name: value.name, image: value.image}, categoryId, userId)
  
  res.status(201).json({
    status: 200,
    success: true,
    message: `${subCategory?.name} successfully fetched.`,
    data: subCategory,
  })
})

const updateSubCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

})

const findSubCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

})

export {
  createCategory,
  updateCategory,
  findCategory,
  findAllCategories,
  createSubCategory,
  updateSubCategory,
  findSubCategory,
};