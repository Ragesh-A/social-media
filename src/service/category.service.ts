import categoryModel from "../model/category.model";
import CategoryModel from "../model/category.model";

const findAllCategories = async (page: number = 1) => {
  return CategoryModel.find().sort({name: 1}).limit(20).skip((--page) * 20)
}

const createCategory = async (
  { name, image }: { name: string, image: string },
  userId: string) => {
  const _existing = await CategoryModel.findOne({ name });
  if (_existing) throw new Error(`${name} category already exist`);

  const category = new categoryModel({
    name, image
  });

  return category.save()
}

const findCategory = async (_id:string) => {
  return categoryModel.findOne({_id})
}

const categoryService = {
  findAllCategories,
  createCategory,
  findCategory
}

export default categoryService;