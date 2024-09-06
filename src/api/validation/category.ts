import { object, string, TypeOf } from "zod";
import { objectId } from "./customerVal/address"; // Assuming objectId validation is defined elsewhere

// Schema for creating a new category
const CreateCategoryBody = object({
  titleTranslations: object({
    en: string({ required_error: "Title is required in English!" }).min(
      3,
      "Title should have at least 3 characters!"
    ),
    ge: string({ required_error: "Title is required in Georgian!" }).min(
      3,
      "Title should have at least 3 characters!"
    ),
  }),
  type: string({ required_error: "Type is required!" }),
  parentId: objectId.optional(), // Using objectId validation for optional parentId
});

// Schema for updating an existing category
const UpdateCategoryBody = object({
  titleTranslations: object({
    en: string({ required_error: "Title is required in English!" })
      .min(3, "Title should have at least 3 characters!")
      .optional(),
    ge: string({ required_error: "Title is required in Georgian!" })
      .min(3, "Title should have at least 3 characters!")
      .optional(),
  }).optional(),
  type: string().optional(), // Type can be updated optionally
  parentId: objectId.optional(), // Using objectId validation for optional parentId update
});

// Params schema for route parameters (e.g., categoryId in /update-category/:categoryId)
export const CategoryParamsSchema = object({
  params: object({ catId: objectId }),
});

// Define schemas that combine body, params, and query validations if needed
export const CreateCategorySchema = object({
  body: CreateCategoryBody, // Full body validation for creating a category
  params: object({}).optional(), // No specific params validation needed for creation
  query: object({}).optional(), // No specific query validation needed
});

export const UpdateCategorySchema = object({
  body: UpdateCategoryBody, // Body validation allows partial updates
  params: object({ catId: objectId }), // Params validation for updating a category by categoryId
  query: object({}).optional(), // No specific query validation needed
});

// TypeScript types for request validation
export type CreateCategorySchemaType = TypeOf<
  typeof CreateCategorySchema
>["body"]; // Type for CreateCategorySchema body
export type UpdateCategorySchemaType = TypeOf<typeof UpdateCategorySchema>; // Type for UpdateCategorySchema, includes both body and params
export type CategoryParamsType = TypeOf<typeof CategoryParamsSchema>["params"]; // Type for CategoryParams
