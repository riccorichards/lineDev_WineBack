import { array, boolean, number, object, string, TypeOf } from "zod";

// Define a custom ObjectId validation
const objectId = string().refine((value) => /^[0-9a-fA-F]{24}$/.test(value), {
  message: "Invalid ObjectId format",
});

// Define the schema for creating a new Wine (request body validation)
const createCommentBody = object({
  blogId: objectId,
  comment: string({
    required_error: "Comment is Required!",
  }).min(1, "Comment must be at least 1 characters"),
});

// Define the schema for updating an existing Comment (request body validation)
const updateCommentBody = object({
  blogId: objectId.optional(),
  comment: string().optional(),
});

// Define schemas that combine body, params, and query validations if needed
export const CreateCommentSchema = object({
  body: createCommentBody,
  params: object({}).optional(),
  query: object({}).optional(),
});

export const UpdateCommentSchema = object({
  body: updateCommentBody,
  params: object({ commentId: objectId }),
  query: object({}).optional(),
});

export const CommentParamsSchema = object({
  params: object({ commentId: objectId }),
});

// Types for Create and Update
export type CreateCommentInput = TypeOf<typeof CreateCommentSchema>["body"];
export type UpdateCommentInput = TypeOf<typeof UpdateCommentSchema>;
export type CommentParamsInput = TypeOf<typeof CommentParamsSchema>["params"];
