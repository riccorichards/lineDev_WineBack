import mongoose from "mongoose";
import { MongooseTypeObject } from "./dto.customer";

export interface BloginputType {
  author: string;
  title: string;
  text: string;
  image: string;
  url: null | string;
  comments: MongooseTypeObject[];
  tags: string[];
}

export interface BlogDocs extends BloginputType, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}
