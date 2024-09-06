import { object, string, TypeOf, number } from "zod";
import { objectId } from "./customerVal/address"; // Assuming objectId validation is defined elsewhere
import { min } from "lodash";

// Schema for creating feedback
const CreateFeedbackBody = object({
  productId: objectId, // Using the custom ObjectId validation for productId
  text: string().optional(), // Feedback text is optional
  rate: number()
    .min(1, "Rate should be at least 1")
    .max(5, "Rate max value should be 5")
    .optional(), // Rating is optional
  productType: string({ required_error: "Product type is required!" }).refine(
    (val) => val === "wine" || val == "cocktail"
  ),
});

// Schema for updating feedback
const UpdateFeedbackBody = object({
  text: string().optional(), // Allow updating feedback text optionally
  rate: number().optional(), // Allow updating rating optionally
});

// Params schema for route parameters (e.g., feedId in /update-feedback/:feedId)
export const FeedbackParamsSchema = object({
  params: object({ feedId: objectId }), // Using the custom ObjectId validation for feedId
});

// Define schemas that combine body, params, and query validations if needed
export const CreateFeedbackSchema = object({
  body: CreateFeedbackBody, // Full body validation for creating feedback
  params: object({}).optional(), // No specific params validation needed for creation
  query: object({}).optional(), // No specific query validation needed
});

export const UpdateFeedbackSchema = object({
  body: UpdateFeedbackBody, // Body validation allows partial updates for feedback
  params: FeedbackParamsSchema, // Params validation for updating feedback by feedId
  query: object({}).optional(), // No specific query validation needed
});

// TypeScript types for request validation
export type CreateFeedbackSchemaType = TypeOf<
  typeof CreateFeedbackSchema
>["body"]; // Type for CreateFeedbackSchema body
export type UpdateFeedbackSchemaType = TypeOf<typeof UpdateFeedbackSchema>; // Type for UpdateFeedbackSchema, includes both body and params
export type FeedbackParamsType = TypeOf<typeof FeedbackParamsSchema>["params"]; // Type for FeedbackParams
