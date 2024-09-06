import mongoose from "mongoose";
import { CommentDocs } from "../dto/dto.comment";

const Comment = new mongoose.Schema(
  {
    author: { type: mongoose.Types.ObjectId, ref: "Customer" },
    comment: { type: String },
    profileImg: { type: String },
    profileUrl: { type: String },
    blogIdId: { type: mongoose.Types.ObjectId, ref: "Blog" },
  },
  { timestamps: true }
);

const CommentModel = mongoose.model<CommentDocs>("Comment", Comment);

export default CommentModel;
