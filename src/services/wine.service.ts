import mongoose, { Types } from "mongoose";
import WineRepository from "../database/wine.repo";
import { WineInputType, UpdateWineInputType } from "../dto/dto.wine";
import { CategoryRepository } from "../database/category.repo";
import {
  ApiError,
  BadRequestError,
  NotFoundError,
} from "../utils/errors/appError.utils";
import { merge } from "lodash";
import { MongooseTypeObject } from "../dto/dto.customer";
import { CreateWineInput } from "../api/validation/wine";

class WineService {
  private repository: WineRepository;
  private catRepo: CategoryRepository;

  constructor() {
    this.repository = new WineRepository();
    this.catRepo = new CategoryRepository();
  }

  async CreateWineService(input: CreateWineInput) {
    const { categoryId } = input;
    const category = await this.catRepo.GetCategoryById(
      new Types.ObjectId(categoryId)
    );
    if (!category)
      throw new NotFoundError("Category was not found by provided ID.");
    const wine = await this.repository.CreateWine(input);

    if (!wine)
      throw new BadRequestError("Error during creation of wine project.");

    category.products.push({
      productId: wine._id as MongooseTypeObject,
      productType: "wine", // Specify the product type
    });
    await category.save();
    return wine;
  }

  async UpdateWineService(
    WineId: mongoose.Types.ObjectId,
    input: UpdateWineInputType
  ) {
    // Fetch the existing document
    const existingWine = await this.repository.GetWineById(WineId);

    if (!existingWine) {
      throw new NotFoundError("Wine was not found.");
    }

    // Merge existing document with the input
    const updatedWine = merge(existingWine.toObject(), input);

    const updated = await this.repository.UpdateWine(WineId, updatedWine);
    if (!updated)
      throw new BadRequestError("Bad request to update wine product.");

    return updated;
  }

  async AllWinesService() {
    const wines = await this.repository.GetAllWines();
    if (!wines) throw new ApiError("Something went wrong.");
    return wines;
  }

  async GetWineService(wineId: string) {
    const wine = await this.repository.GetWine(new Types.ObjectId(wineId));
    if (!wine) throw new NotFoundError("Wine was not found.");
    return wine;
  }

  async DeleteWineService(productId: string) {
    const removedChecker = await this.repository.DeleteWine(productId);
    if (removedChecker.deletedCount < 1)
      throw new NotFoundError("Wine not found or wine is not available.");

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
    if (searchResult.length < 1) throw new NotFoundError("Wine was not found.");

    return searchResult.map((item) => {
      return {
        title:
          lang === "en" ? item.titleTranslations.en : item.titleTranslations.ge,
        image: item.image,
        price: item.price,
      };
    });
  }

  async GetWineFilters(target: string) {
    const filters = await this.repository.GetWineFilters(target);
    if (!filters) throw new NotFoundError("Wine was not found provded query.");
    return filters;
  }

  async GetWinePriceRangeService(minPrice: number, maxPrice: number) {
    const result = await this.repository.GetWinePriceRange(minPrice, maxPrice);
    if (result.length < 1)
      throw new NotFoundError(
        "Wine products was not found provided price range."
      );

    return result;
  }

  async GetPopularWinesService(page: number) {
    const result = await this.repository.GetPopularWines(page);
    if (!result) throw new ApiError();
    return result;
  }

  async GetRelativeWinesService(catetogyId: MongooseTypeObject, page: number) {
    const result = await this.repository.GetRelativeWines(catetogyId, page);
    if (!result) throw new ApiError();
    return result;
  }

  async GetWineStatsService(wineId: MongooseTypeObject) {
    const result = await this.repository.GetWineById(wineId);
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

export default WineService;
