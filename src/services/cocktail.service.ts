import mongoose from "mongoose";
import CocktailRepository from "../database/cocktail.repo";
import {
  CocktailInputType,
  UpdateCocktailInputType,
} from "../dto/dto.cocktails";
import { CategoryRepository } from "../database/category.repo";
import {
  ApiError,
  BadRequestError,
  NotFoundError,
} from "../utils/errors/appError.utils";
import { merge } from "lodash";

class CocktailService {
  private repository: CocktailRepository;
  private catRepo: CategoryRepository;

  constructor() {
    this.repository = new CocktailRepository();
    this.catRepo = new CategoryRepository();
  }

  async CreateCocktailService(input: CocktailInputType) {
    const { categoryId } = input;
    const category = await this.catRepo.GetCategoryById(categoryId);
    if (!category) throw new NotFoundError("Category was not found by ID");
    const cocktail = await this.repository.CreateCocktail(input);
    if (!cocktail)
      throw new BadRequestError("Error during creation of cocktail process.");

    category.products.push({
      productId: cocktail._id as mongoose.Types.ObjectId,
      productType: "cocktail",
    });
    await category.save();
    return cocktail;
  }

  async UpdateCocktailService(
    CocktailId: mongoose.Types.ObjectId,
    input: UpdateCocktailInputType
  ) {
    // Fetch the existing document
    const existingCocktail = await this.repository.GetCocktailById(CocktailId);

    if (!existingCocktail) throw new NotFoundError("Cocktail was not found");

    // Merge existing document with the input
    const updatedCocktail = merge(existingCocktail.toObject(), input);

    const updated = await this.repository.UpdateCocktail(
      CocktailId,
      updatedCocktail
    );
    if (!updated)
      throw new BadRequestError("Error during update of cocktail process.");

    return updated;
  }

  async AllCocktailsService() {
    const cocktails = await this.repository.GetAllCocktails();
    if (!cocktails) throw new ApiError("Something went wrong.");
    return cocktails;
  }

  async GetCocktailService(CocktailId: mongoose.Types.ObjectId) {
    const cocktail = await this.repository.GetCocktail(CocktailId);
    if (!cocktail) throw new NotFoundError("Cocktail was not found");
    return cocktail;
  }

  async DeleteCocktailService(CocktailId: string) {
    const removedChecker = await this.repository.DeleteCocktail(CocktailId);
    if (removedChecker.deletedCount < 1)
      throw new NotFoundError("Cocktail was not found to be removed.");

    return true;
  }
}

export default CocktailService;
