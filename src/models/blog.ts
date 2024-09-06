import mongoose from "mongoose";
import { BlogDocs } from "../dto/dto.blog";

const Blog = new mongoose.Schema(
  {
    author: { type: mongoose.Types.ObjectId, ref: "Customer" },
    title: { type: String },
    text: { type: String },
    image: { type: String },
    url: { type: String },
    comments: [{ type: mongoose.Types.ObjectId, ref: "Comment" }],
    tags: [{ type: String }]
  },
  { timestamps: true }
);

const BlogModel = mongoose.model<BlogDocs>("Blog", Blog);

export default BlogModel;
