import { CategoryModel, SubCategoryModel } from "../model/category.model";

const findAllCategories = async (page: number = 1) => {
  return CategoryModel.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'createdBy',
        foreignField: '_id',
        as: 'createdBy'
      }
    },
    {
      $lookup: {
        from: 'subcategories',
        localField: '_id',
        foreignField: 'category',
        as: 'subCategories'
      },

    },
    {$unwind: '$createdBy'},{
      $project: {
        'createdBy.password': 0
      }
    }, {
      $sort: {name: 1}
    }])
}

const createCategory = async (
  { name, image }: { name: string, image: string },
  createdBy: string) => {
  const _existing = await CategoryModel.findOne({ name });
  if (_existing) throw new Error(`${name} category already exist`);

  const category = new CategoryModel({
    name, image, createdBy
  });

  return (await category.save()).populate('createdBy')
}

const findCategory = async (_id: string) => {
  const _categoryPromise = CategoryModel.findOne({ _id }).populate('createdBy')
  const _subcategoryPromise = SubCategoryModel.find({ 'category': _id });
  const [category, subCategory] = await Promise.all([_categoryPromise, _subcategoryPromise]);
  if (!category) throw new Error('no such category ');

  return { category, subCategory }
}


const createSubCategory = async (
  { name, image }: { name: string, image: string },
  category: string,
  createdBy: string) => {
  const _existing = await SubCategoryModel.findOne({ category, name });
  if (_existing) throw new Error(`${name} sub-category already exist`);

  const _category = new SubCategoryModel({
    name, image, createdBy, category
  });

  return _category.save()
}


const categoryService = {
  findAllCategories,
  createCategory,
  createSubCategory,
  findCategory
}

export default categoryService;