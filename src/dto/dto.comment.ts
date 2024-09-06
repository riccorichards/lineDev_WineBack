import mongoose from "mongoose";
import { MongooseTypeObject } from "./dto.customer";

export interface CommentinputType {
  author: string;
  comment: string;
  profileImg: string;
  profileUrl: null | string;
  blogId: MongooseTypeObject;
}

export interface CommentDocs extends CommentinputType, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}
