import mongoose, { Types } from "mongoose";
import { CreateFeedbackSchemaType } from "../api/validation/feedback";
import FeedbackRepository from "../database/feedbacks.repo";
import {
  ApiError,
  BadRequestError,
  NotFoundError,
} from "../utils/errors/appError.utils";
import WineRepository from "../database/wine.repo";
import CocktailRepository from "../database/cocktail.repo";
import CustomerRepository from "../database/customer.repo";
import { CustomerInput } from "../dto/dto.customer";

class FeedbackService {
  private repository: FeedbackRepository;
  private wineRepo: WineRepository;
  private cocktailRepo: CocktailRepository;
  private customerRepo: CustomerRepository;

  constructor() {
    this.repository = new FeedbackRepository();
    this.wineRepo = new WineRepository();
    this.cocktailRepo = new CocktailRepository();
    this.customerRepo = new CustomerRepository();
  }

  async CreateFeedbackService(author: string, input: CreateFeedbackSchemaType) {
    const { productId, productType } = input;
    const productObjectId = new Types.ObjectId(productId);
    const authorObjectId = new Types.ObjectId(author);
    const existingFeedback = await this.repository.CheckFeedbackPerCustomer(
      productObjectId,
      authorObjectId
    );
    if (existingFeedback) throw new BadRequestError("Feedback already exists.");
    const profile = await this.customerRepo.FindCustomerById(author);
    const { username, image } = profile as CustomerInput;
    if (!profile) throw new NotFoundError("Author was not found.");

    let product =
      productType === "wine"
        ? await this.wineRepo.GetWine(productObjectId)
        : await this.cocktailRepo.GetCocktailById(productObjectId);
    if (!product) throw new BadRequestError("Product was not found.");

    const feedback = await this.repository.CreateFeedback(
      input,
      image,
      username
    );
    if (!feedback)
      throw new BadRequestError("Error during creation of feedback process.");
    product.feedback.push(feedback._id as mongoose.Types.ObjectId);

    if (feedback.rate) {
      product.lenRate = product.lenRate += 1;
      product.sumRate = product.sumRate += feedback.rate;
      product.avgRate = product.sumRate / product.lenRate;
      await product.save();
    }

    return await feedback.save();
  }

  async GetAllFeedbackService() {
    const feedbacks = await this.repository.GetAllFeedbacks();
    if (!feedbacks) throw new ApiError("Something went wrong.");
    return feedbacks;
  }

  async GetCustomerFeedbackService(author: string) {
    const customerFeed = await this.repository.GetCustomersFeedback(author);
    if (!customerFeed)
      throw new BadRequestError(
        "Data is not available or customer was not found."
      );

    return customerFeed;
  }

  async GetCustomerFeedbackLengthService(author: string) {
    const customerFeed = await this.repository.GetCustomersFeedback(author);
    if (!customerFeed)
      throw new BadRequestError(
        "Data is not available or customer was not found."
      );

    return customerFeed;
  }

  async RemoveFeedbackService(feedId: string) {
    const removedChecker = await this.repository.RemoveFeedback(feedId);
    if (removedChecker.deletedCount < 1)
      throw new BadRequestError("Feedback not found to be removed.");

    return true;
  }
}

export default FeedbackService;
