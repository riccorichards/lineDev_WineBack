import mongoose from "mongoose";
import { MongooseTypeObject } from "./dto.customer";

export interface FeedbackType {
  author: string;
  productId: MongooseTypeObject;
  profileImg: string;
  profileUrl: null | string;
  text: string | null;
  rate: number | null;
  productType: "wine" | "cocktail";
}

export interface FeedbackDocType extends FeedbackType, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}
