import { CreateBlogInput, UpdateBlogInput } from "../api/validation/blog";
import BlogRepository from "../database/blog.repo";
import {
  ApiError,
  BadRequestError,
  NotFoundError,
} from "../utils/errors/appError.utils";

class BlogService {
  private repository: BlogRepository;

  constructor() {
    this.repository = new BlogRepository();
  }

  async CreateBlogService(input: CreateBlogInput) {
    const blog = await this.repository.CreateBlog(input);
    if (!blog) throw new BadRequestError("Error during creation process.");
    return blog;
  }

  async UpdateBlogService(BlogId: string, input: UpdateBlogInput["body"]) {
    const blog = await this.repository.UpdateBlog(BlogId, input);
    if (!blog) throw new BadRequestError("Could not able to update.");
    return blog;
  }

  async AllBlogsService() {
    const blogs = await this.repository.GetAllBlogs();
    if (!blogs) throw new ApiError("Something went wrong.");
    return blogs;
  }

  async GetBlogService(BlogId: string) {
    const blog = await this.repository.GetBlog(BlogId);
    if (!blog) throw new NotFoundError("Blog was not found.");
    return blog;
  }

  async GetRelatedBlogService(BlogId: string) {
    // Fetch the current blog to get its tags
    const currentBlog = await this.repository.GetBlog(BlogId);
    if (!currentBlog) {
      throw new NotFoundError("Blog not found.");
    }
    const { tags } = currentBlog;
    // Find related blogs with at least one matching tag, excluding the current blog
    return await this.repository.GetRelatedBlogs(BlogId, 5, tags);
  }

  async DeleteBlogService(BlogId: string) {
    const removedChecker = await this.repository.DeleteBlog(BlogId);
    if (removedChecker.deletedCount < 1)
      throw new BadRequestError(
        "Data is not available or does not exist to remove."
      );
    return true;
  }
}

export default BlogService;
