import { array, boolean, number, object, string, TypeOf } from "zod";

// Define a custom ObjectId validation
const objectId = string().refine((value) => /^[0-9a-fA-F]{24}$/.test(value), {
  message: "Invalid ObjectId format",
});

// Define the schema for creating a new Wine (request body validation)
const createBlogBody = object({
  image: string({
    required_error: "Image is Required!",
  }),
  url: string().url("Invalid URL format").nullable().optional(), // Ensures the URL is in a valid format, allowing null
  author: objectId,
  title: string({
    required_error: "Title is Required!",
  }).min(0, "Title must be at least 2 characters"),
  text: string({
    required_error: "Text is Required!",
  }).min(0, "Text must be at least 2 characters"),
  tags: array(string()),
});

// Define the schema for updating an existing Blog (request body validation)
const updateBlogBody = object({
  image: string().optional(),
  url: string().url("Invalid URL format").nullable().optional(), // Ensures the URL is in a valid format, allowing null
  author: objectId.optional(),
  title: string().optional(),
  text: string().optional(),
  tags: array(string()).optional(),
  comments: objectId.optional(),
});

export const BlogParams = object({
  params: object({ blogId: objectId }),
});

// Define schemas that combine body, params, and query validations if needed
export const CreateBlogSchema = object({
  body: createBlogBody,
  params: object({}).optional(),
  query: object({}).optional(),
});

export const UpdateBlogSchema = object({
  body: updateBlogBody,
  params: object({ blogId: objectId }),
  query: object({}).optional(),
});

export const AllBlogsQuery = object({
  query: object({
    isLastThree: string().optional(),
  }),
});

// Types for Create and Update
export type CreateBlogInput = TypeOf<typeof CreateBlogSchema>["body"];
export type UpdateBlogInput = TypeOf<typeof UpdateBlogSchema>;
export type BlogParamsInput = TypeOf<typeof BlogParams>["params"];
export type AllBlogsQueryInput = TypeOf<typeof AllBlogsQuery>["query"];
