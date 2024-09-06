import mongoose from "mongoose";
import { FeedbackDocType } from "../dto/dto.feedbacks";

const feeds = new mongoose.Schema(
  {
    author: { type: String },
    productId: { type: String },
    text: { type: String },
    username: { type: String },
    profileImg: { type: String },
    profileUrl: { type: String, default: null },
    rate: { type: Number },
    productType: { type: String, enum: ["wine", "cocktail"] },
  },
  { timestamps: true }
);

const FeedsModel = mongoose.model<FeedbackDocType>("Feedbacks", feeds);

export default FeedsModel;
