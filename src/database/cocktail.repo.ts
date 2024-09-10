import {
  CocktailInputType,
  UpdateCocktailInputType,
} from "../dto/dto.cocktails";
import CocktailModel from "../models/cocktail";
import { MongooseTypeObject } from "../dto/dto.customer";

class CocktailRepository {
  async CreateCocktail(input: CocktailInputType) {
    return await CocktailModel.create({
      ...input,
      feedbacks: [],
    });
  }

  async UpdateCocktail(
    CocktailId: MongooseTypeObject,
    updatedCocktail: UpdateCocktailInputType
  ) {
    return await CocktailModel.findByIdAndUpdate(
      CocktailId,
      { $set: updatedCocktail },
      { new: true }
    );
  }

  async GetAllCocktails() {
    return CocktailModel.find();
  }

  async GetCocktail(CocktailId: MongooseTypeObject) {
    return await CocktailModel.findByIdAndUpdate(
      CocktailId,
      { $inc: { clickCount: 1 } },
      { new: true }
    ).populate({
      path: "feedback",
      model: "Feedbacks",
    });
  }

  async GetCocktailById(CocktailId: MongooseTypeObject) {
    return await CocktailModel.findById(CocktailId);
  }

  async DeleteCocktail(CocktailId: string) {
    return await CocktailModel.deleteOne({ _id: CocktailId });
  }

  async IncreaseCocktailByOne(productId: string) {
    return await CocktailModel.findByIdAndUpdate(
      productId,
      { $inc: { wishlistCount: 1 } },
      { new: true }
    );
  }

  async IncreaseCartCocktailByOne(productId: string) {
    return await CocktailModel.findByIdAndUpdate(
      productId,
      { $inc: { cartCount: 1 } },
      { new: true }
    );
  }

  async SearchByTitle(searchField: string, title: string) {
    const regex = new RegExp(title, "i");
    return await CocktailModel.find({
      [searchField]: { $regex: regex },
    });
  }

  async GetCocktailPriceRange(minPrice: number, maxPrice: number) {
    return await CocktailModel.find({
      price: { $gte: minPrice, $lte: maxPrice },
    }).select("titleTranslations price discount image");
  }

  async GetPopularCocktails(page: number = 0, limit: number = 3) {
    return await CocktailModel.aggregate([
      {
        $project: {
          image: 1,
          titleTranslations: 1,
          price: {
            $toString: "$price",
          },
          discount: 1,
          popularityScore: {
            $add: [
              { $multiply: ["$clickCount", 0.1] },
              { $multiply: ["$cartCount", 0.3] },
              { $multiply: ["$wishlistCount", 0.2] },
              { $multiply: ["$orderCount", 0.4] },
            ],
          },
        },
      },
      { $sort: { popularityScore: -1 } },
      { $skip: page * limit },
      { $limit: limit },
    ]);
  }

  async GetRelativeCocktails(categoryId: MongooseTypeObject, page: number = 0) {
    const limit = 3;
    return await CocktailModel.find({ categoryId })
      .skip(limit * page)
      .limit(limit)
      .select("titleTranslations price discount image");
  }
}

export default CocktailRepository;
