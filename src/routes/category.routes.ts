import { Router } from "express";
import * as categoryController from "../controller/category.controller";
import { adminMiddleWare } from "../middleware";

const router = Router();

router.route('/')
  .get(categoryController.findAllCategories)//
  .post(adminMiddleWare,categoryController.createCategory)//

router.route('/:categoryId')
  .get(categoryController.findCategory)
  .patch(categoryController.updateCategory)
  .post(categoryController.createSubCategory);

// router.route('/:categoryId/:subcategoryId')
//   .get(categoryController.findSubCategory)
//   .patch(categoryController.updateSubCategory);

export default router;