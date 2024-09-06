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
}

export default CocktailRepository;
