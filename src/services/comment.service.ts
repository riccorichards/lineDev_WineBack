import {
  CreateCommentInput,
  UpdateCommentInput,
} from "../api/validation/comment";
import BlogRepository from "../database/blog.repo";
import CommentRepository from "../database/comment.repo";
import {
  ApiError,
  BadRequestError,
  NotFoundError,
} from "../utils/errors/appError.utils";
import { MongooseTypeObject } from "../dto/dto.customer";
import CustomerRepository from "../database/customer.repo";

class CommentService {
  private repository: CommentRepository;
  private blogRepo: BlogRepository;
  private customerRepo: CustomerRepository;

  constructor() {
    this.repository = new CommentRepository();
    this.blogRepo = new BlogRepository();
    this.customerRepo = new CustomerRepository();
  }

  async CreateCommentService(author: string, input: CreateCommentInput) {
    const { blogId } = input;
    const blog = await this.blogRepo.GetBlogById(blogId);
    if (!blog) throw new NotFoundError("Blog was not found.");

    const profile = await this.customerRepo.FindCustomerById(author);
    if (!profile) throw new NotFoundError("Customer was not found");

    const comment = await this.repository.CreateComment(
      author,
      profile.image,
      profile.username,
      input
    );
    if (!comment)
      throw new BadRequestError("Error during creation of comment.");

    blog.comments.push(comment._id as MongooseTypeObject);
    await blog.save();
    return comment;
  }

  async UpdateCommentService(
    CommentId: string,
    input: UpdateCommentInput["body"]
  ) {
    const updatedComment = await this.repository.UpdateComment(
      CommentId,
      input
    );
    if (!updatedComment) throw new BadRequestError("Something went wrong.");
    return updatedComment;
  }

  async AllCommentsService() {
    const comments = await this.repository.GetAllComments();
    if (!comments) throw new ApiError("Something went wrong.");
    return comments;
  }

  async DeleteCommentService(CommentId: string) {
    const deleteChecker = await this.repository.DeleteComment(CommentId);
    if (deleteChecker.deletedCount < 1)
      throw new NotFoundError("Comment is not available or it does not exist.");

    return true;
  }
}

export default CommentService;
