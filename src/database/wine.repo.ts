import { UpdateWineInputType } from "../dto/dto.wine";
import WineModel from "../models/wine";
import { MongooseTypeObject } from "../dto/dto.customer";
import { CreateWineInput } from "../api/validation/wine";

class WineRepository {
  async CreateWine(input: CreateWineInput) {
    return await WineModel.create({
      ...input,
      feedback: [],
      lenRate: 0,
      sumRate: 0,
      avgRate: 0,
      clickCount: 0,
      cartCount: 0,
      wishlistCount: 0,
      orderCount: 0,
    });
  }

  async UpdateWine(WineId: MongooseTypeObject, input: UpdateWineInputType) {
    return await WineModel.findByIdAndUpdate(
      WineId,
      { $set: input },
      { new: true }
    );
  }

  async GetAllWines() {
    return WineModel.find();
  }

  async GetWine(WineId: MongooseTypeObject) {
    return await WineModel.findByIdAndUpdate(
      WineId,
      { $inc: { clickCount: 1 } },
      { new: true }
    ).populate({
      path: "feedback",
      model: "Feedbacks",
    });
  }

  async GetWineById(WineId: MongooseTypeObject) {
    return await WineModel.findById(WineId);
  }

  async DeleteWine(WineId: string) {
    return await WineModel.deleteOne({ _id: WineId });
  }

  async IncreaseWineByOne(productId: string) {
    return await WineModel.findByIdAndUpdate(
      productId,
      { $inc: { wishlistCount: 1 } },
      { new: true }
    );
  }

  async IncreaseCartWineByOne(productId: string) {
    return await WineModel.findByIdAndUpdate(
      productId,
      { $inc: { cartCount: 1 } },
      { new: true }
    );
  }

  async SearchByTitle(searchField: string, title: string) {
    const regex = new RegExp(title, "i");
    return await WineModel.find({
      [searchField]: { $regex: regex },
    }).select("titleTranslations price discount url");
  }

  async GetWineFilters(filters: string) {
    if (filters === "available") {
      return await WineModel.find({ available: true }).select(
        "titleTranslations price discount url"
      );
    } else if (filters === "latest") {
      return await WineModel.find()
        .sort({ createdAt: -1 })
        .select("titleTranslations price discount url");
    } else if (filters === "cheapest") {
      return await WineModel.find()
        .sort({ price: 1 })
        .select("titleTranslations price discount url");
    }
  }

  async GetWinePriceRange(minPrice: number, maxPrice: number) {
    return await WineModel.find({
      price: { $gte: minPrice, $lte: maxPrice },
    }).select("titleTranslations price discount url");
  }

  async GetPopularWines(page: number = 0) {
    const limit = 3;
    return await WineModel.aggregate([
      {
        $project: {
          url: 1,
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

  async GetRelativeWines(categoryId: MongooseTypeObject, page: number = 0) {
    const limit = 3;
    return await WineModel.find({ categoryId })
      .skip(limit * page)
      .limit(limit)
      .select("titleTranslations price discount url");
  }
}

export default WineRepository;
