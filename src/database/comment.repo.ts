import {
  CreateCommentInput,
  UpdateCommentInput,
} from "../api/validation/comment";
import CommentModel from "../models/comment";

class CommentRepository {
  async CreateComment(
    author: string,
    image: string,
    username: string,
    input: CreateCommentInput
  ) {
    return await CommentModel.create({
      ...input,
      profileImg: image,
      author,
      username,
    });
  }

  async UpdateComment(CommentId: string, input: UpdateCommentInput["body"]) {
    return await CommentModel.findByIdAndUpdate(
      CommentId,
      { $set: input }, // Replace existing fields with those in 'input'
      { new: true }
    );
  }

  async GetAllComments(offset = 0, pages = 10) {
    return CommentModel.find().skip(offset).limit(pages);
  }

  async DeleteComment(CommentId: string) {
    return await CommentModel.deleteOne({ _id: CommentId });
  }
}

export default CommentRepository;
