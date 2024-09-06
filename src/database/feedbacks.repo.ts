import FeedsModel from "../models/feedback";
import { CreateFeedbackSchemaType } from "../api/validation/feedback";
import { MongooseTypeObject } from "../dto/dto.customer";

class FeedbackRepository {
  async CreateFeedback(
    input: CreateFeedbackSchemaType,
    image: string,
    username: string
  ) {
    return await FeedsModel.create({ ...input, profileImg: image, username });
  }

  async GetAllFeedbacks() {
    return await FeedsModel.find();
  }

  async GetCustomersFeedback(author: string) {
    return await FeedsModel.find({ author });
  }

  async CheckFeedbackPerCustomer(
    productId: MongooseTypeObject,
    author: MongooseTypeObject
  ) {
    return await FeedsModel.findOne({ productId, author });
  }

  async RemoveFeedback(feedId: string) {
    return await FeedsModel.deleteOne({ _id: feedId });
  }
}

export default FeedbackRepository;
