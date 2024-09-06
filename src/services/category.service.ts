import mongoose, { Types } from "mongoose";
import { CreateCategorySchemaType } from "../api/validation/category";
import { CategoryRepository } from "../database/category.repo";
import CocktailRepository from "../database/cocktail.repo";
import WineRepository from "../database/wine.repo";
import { CategoryDoc, UpdateCategoryInputType } from "../dto/dto.category";
import {
  ApiError,
  BadRequestError,
  NotFoundError,
} from "../utils/errors/appError.utils";
import { MongooseTypeObject } from "../dto/dto.customer";

class CategoryService {
  private repository: CategoryRepository;
  private wineRepo: WineRepository;
  private cocktailRepo: CocktailRepository;

  constructor() {
    this.repository = new CategoryRepository();
    this.wineRepo = new WineRepository();
    this.cocktailRepo = new CocktailRepository();
  }

  async CreateCategoryService(input: CreateCategorySchemaType) {
    const { parentId } = input;
    const parentIdObject = new Types.ObjectId(parentId);
    const newCategory = await this.repository.CreateCategory(input);
    if (!newCategory)
      throw new BadRequestError("Error during creation of category process.");
    if (parentId) {
      const parentCategory = (await this.repository.GetCategoryById(
        parentIdObject
      )) as CategoryDoc;
      // Push only the new category's ID into the subCategories array
      parentCategory.subCategories.push(
        newCategory._id as mongoose.Types.ObjectId
      );
      await parentCategory.save();
    }

    return newCategory;
  }

  async GetAllCategoriesService() {
    const categories = await this.repository.GetAllCategories();
    if (!categories) throw new ApiError("Something went wrong.");
    return categories;
  }

  async GetAllWineCategoriesService() {
    const wineCats = await this.repository.GetAllWineCategories();
    if (!wineCats) throw new ApiError("Something went wrong.");
    return wineCats;
  }

  async GetAllCocktailCategoriesService() {
    const cocktailCats = await this.repository.GetAllCocktailCategories();
    if (!cocktailCats) throw new ApiError("Something went wrong.");
    return cocktailCats;
  }

  async GetCategoryService(catId: MongooseTypeObject, per?: number) {
    const category = await this.repository.GetCategoryById(catId);
    if (!category) throw new NotFoundError("Category not found");

    const populatedProducts = [];
    // Iterate through the products array in the category
    for (const product of category.products) {
      // Check the product type and fetch the corresponding product
      if (product.productType === "wine") {
        const wine = await this.wineRepo.GetWineById(product.productId);
        if (wine) {
          populatedProducts.push(wine);
        }
      } else if (product.productType === "cocktail") {
        const cocktail = await this.cocktailRepo.GetCocktailById(
          product.productId
        );
        if (cocktail) {
          populatedProducts.push(cocktail);
        }
      }
    }

    const paginatedProducts = per
      ? populatedProducts.slice(0, per)
      : populatedProducts;

    return {
      ...category.toObject(),
      products: paginatedProducts,
    };
  }

  async UpdateCategoryService(input: UpdateCategoryInputType) {
    const updatedCat = await this.repository.UpdateCategory(input);
    if (!updatedCat)
      throw new BadRequestError("Bad request to update category.");
    return updatedCat;
  }

  async DeleteCategoryService(carId: string) {
    const removeChecker = await this.repository.DeleteCategory(carId);
    if (removeChecker.deletedCount < 1)
      throw new BadRequestError(
        "Data is not available or category is not defined."
      );

    return true;
  }
}

export default CategoryService;
