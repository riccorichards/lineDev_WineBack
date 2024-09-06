import { CategoryDoc, UpdateCategoryInputType } from "../dto/dto.category";
import CategoryModel from "../models/category";
import { CreateCategorySchemaType } from "../api/validation/category";
import { MongooseTypeObject } from "../dto/dto.customer";

export class CategoryRepository {
  async CreateCategory({
    titleTranslations,
    type,
    parentId,
  }: CreateCategorySchemaType) {
    // create a new category
    const newCategory = await CategoryModel.create({
      titleTranslations,
      type,
      parentId,
      subCategory: [],
      products: [],
    });
    return newCategory;
  }

  async GetAllCategories() {
    return await CategoryModel.find({ parentId: null }).populate({
      path: "subCategories",
      model: "Category",
      populate: {
        path: "subCategories",
        model: "Category",
        populate: {
          path: "subCategories",
          model: "Category",
        },
      },
    });
  }

  async GetAllWineCategories() {
    return CategoryModel.find({ parentId: null, type: "wine" }).populate({
      path: "subCategories",
      model: "Category",
      populate: {
        path: "subCategories",
        model: "Category",
        populate: {
          path: "subCategories",
          model: "Category",
        },
      },
    });
  }

  async GetAllCocktailCategories() {
    return CategoryModel.find({ parentId: null, type: "cocktail" }).populate({
      path: "subCategories",
      model: "Category",
      populate: {
        path: "subCategories",
        model: "Category",
        populate: {
          path: "subCategories",
          model: "Category",
        },
      },
    });
  }

  async GetCategoryById(id: MongooseTypeObject) {
    return await CategoryModel.findById(id);
  }

  async UpdateCategory({ catId, titleTranslations }: UpdateCategoryInputType) {
    let category = (await CategoryModel.findById(catId)) as CategoryDoc;
    if (!category) return `Category with ID ${catId} not found`;
    if (titleTranslations) {
      category.titleTranslations = {
        ...category.titleTranslations,
        ...titleTranslations,
      };
    }
    return await category.save();
  }

  async DeleteCategory(id: string) {
    return CategoryModel.deleteOne({ _id: id });
  }
}
