import {
  WineInputType,
  UpdateWineInputType,
  FilterQueriesType,
} from "../dto/dto.wine";
import WineModel from "../models/wine";
import { MongooseTypeObject } from "../dto/dto.customer";

class WineRepository {
  async CreateWine(input: WineInputType) {
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

  async FilerWineProperties(queries: FilterQueriesType) {
    try {
      // Extract query parameters
      const {
        year,
        region,
        country,
        technology,
        alcohol,
        brand,
        price,
        familyCellar,
        grapesVariety,
        available,
      } = queries;

      // Build a dynamic query object based on provided query parameters
      const query: any = {};

      if (year) query.year = year;
      if (region) query.region = region;
      if (country) query.country = country;
      if (technology) query.technology = technology;
      if (alcohol) query.alcohol = { $eq: alcohol }; // Assuming alcohol is a string or number
      if (brand) query.brand = brand;
      if (price) query.price = { $lte: price }; // Example to filter wines with price less than or equal to the specified value
      if (familyCellar) query.familyCellar = familyCellar;
      if (grapesVariety) query.grapesVariety = grapesVariety;
      if (available) query.available = available === "true"; // Assuming available is a boolean

      // Execute the query
      return await WineModel.find(query);
    } catch (error: any) {
      return error.message;
    }
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
}

export default WineRepository;
