import { Router } from "express";
import * as categoryController from "../controller/category.controller";

const router = Router();

router.route('/')
  .get(categoryController.findAllCategories)//
  .post(categoryController.createCategory)//

// router.route('/:categoryId')
//   .get(categoryController.findCategory)
//   .patch(categoryController.updateCategory)
//   .post(categoryController.createSubCategory);

// router.route('/:categoryId/:subcategoryId')
//   .get(categoryController.findSubCategory)
//   .patch(categoryController.updateSubCategory);

export default router;