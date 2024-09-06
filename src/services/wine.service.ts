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

class WineService {
  private repository: WineRepository;
  private catRepo: CategoryRepository;

  constructor() {
    this.repository = new WineRepository();
    this.catRepo = new CategoryRepository();
  }

  async CreateWineService(input: WineInputType) {
    const { categoryId } = input;
    const category = await this.catRepo.GetCategoryById(categoryId);
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
    if (!wine) throw new NotFoundError("Wine not found");
    return wine;
  }

  async DeleteWineService(productId: string) {
    const removedChecker = await this.repository.DeleteWine(productId);
    if (removedChecker.deletedCount < 1)
      throw new NotFoundError("Wine not found or wine is not available.");

    return true;
  }

  // async FilterWineService(queries: FilterQueriesType) {
  //   try {
  //     return await this.repository.FilerWine(queries);
  //   } catch (error: any) {
  //     throw new Error(error.message);
  //   }
  // }
}

export default WineService;
