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
import { MongooseTypeObject } from "../dto/dto.customer";

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

  async SearchByTitleService(lang: string, title: string) {
    if (!lang || !title) throw new BadRequestError("Invalid query format.");
    const searchField =
      lang === "en" ? "titleTranslations.en" : "titleTranslations.ge";

    const searchResult = await this.repository.SearchByTitle(
      searchField,
      title
    );

    if (searchResult.length < 1)
      throw new NotFoundError("Cocktails was not found.");

    return searchResult.map((item) => {
      return {
        title:
          lang === "en" ? item.titleTranslations.en : item.titleTranslations.ge,
        image: item.image,
        price: item.price,
      };
    });
  }

  async GetCocktailPriceRangeService(minPrice: number, maxPrice: number) {
    const result = await this.repository.GetCocktailPriceRange(
      minPrice,
      maxPrice
    );
    if (result.length < 1)
      throw new NotFoundError(
        "Cocktail products was not found provided price range."
      );

    return result;
  }

  async GetPopularCocktailsService(page: number) {
    const result = await this.repository.GetPopularCocktails(page);
    if (!result) throw new ApiError();
    return result;
  }

  async GetRelativeCocktailsService(
    catetogyId: MongooseTypeObject,
    page: number
  ) {
    const result = await this.repository.GetRelativeCocktails(catetogyId, page);
    if (!result) throw new ApiError();
    return result;
  }

  async GetCocktailStatsService(productId: MongooseTypeObject) {
    const result = await this.repository.GetCocktailById(productId);
    if (!result) throw new NotFoundError("Wine was not found provided ID.");

    const inActionSum =
      result.clickCount +
      result.orderCount +
      result.wishlistCount +
      result.cartCount;
      
    return {
      viewPercentage: (result.clickCount / inActionSum) * 100,
      wishlistPercentage: (result.wishlistCount / inActionSum) * 100,
      cartPercentage: (result.cartCount / inActionSum) * 100,
      orderPercentage: (result.orderCount / inActionSum) * 100,
    };
  }
}

export default CocktailService;
