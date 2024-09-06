import { CreateBlogInput, UpdateBlogInput } from "../api/validation/blog";
import BlogModel from "../models/blog";

class BlogRepository {
  async CreateBlog(input: CreateBlogInput) {
    return await BlogModel.create({ ...input, comments: [] });
  }

  async UpdateBlog(BlogId: string, input: UpdateBlogInput["body"]) {
    return await BlogModel.findByIdAndUpdate(
      BlogId,
      { $set: { ...input } },
      { new: true }
    );
  }

  async GetAllBlogs() {
    return BlogModel.find();
  }

  async GetBlog(BlogId: string) {
    return await BlogModel.findByIdAndUpdate(BlogId).populate({
      path: "comments",
      model: "Comment",
    });
  }

  async GetBlogById(BlogId: string) {
    return await BlogModel.findById(BlogId);
  }

  async GetRelatedBlogs(currentBlogId: string, limit = 5, tags: string[]) {
    return await BlogModel.find({
      _id: { $ne: currentBlogId }, // Exclude the current blog
      tags: { $in: tags }, // Find blogs with at least one matching tag
    })
      .limit(limit) // Limit the number of related blogs returned
      .exec();
  }

  async DeleteBlog(BlogId: string) {
    return await BlogModel.deleteOne({ _id: BlogId });
  }
}

export default BlogRepository;
