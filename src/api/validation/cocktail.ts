import { array, boolean, number, object, string, TypeOf } from "zod";

// Define a custom ObjectId validation
const objectId = string().refine((value) => /^[0-9a-fA-F]{24}$/.test(value), {
  message: "Invalid ObjectId format",
});

// Define the schema for creating a new Wine (request body validation)
const createCocktailBody = object({
  image: string({
    required_error: "Image is Required!",
  }),
  url: string().url("Invalid URL format").nullable().optional(), // Ensures the URL is in a valid format, allowing null
  price: string().refine(
    (value) => !isNaN(parseFloat(value)) && parseFloat(value) > 0,
    { message: "Price must be a positive number" }
  ),
  alcohol: number()
    .min(0, "Alcohol content must be at least 0%")
    .max(100, "Alcohol content cannot exceed 100%")
    .optional(), // Ensures the alcohol content is between 0 and 100%
  available: boolean().optional(),
  discount: number().min(0, "Discount must be at least 0").optional(),
  categoryId: objectId, // Validates ObjectId
  translations: object({
    title: object({
      en: string().optional(),
      ge: string().optional(),
    }),
    description: object({
      en: string().optional(),
      ge: string().optional(),
    }),
    ingredients: object({
      en: array(string()).optional(),
      ge: array(string()).optional(),
    }),
  }).optional(),
});

// Define the schema for updating an existing Cocktail (request body validation)
const updateCocktailBody = object({
  image: string({
    required_error: "Image is Required!",
  }).optional(),
  url: string().url("Invalid URL format").nullable().optional(), // Ensures the URL is in a valid format, allowing null
  price: string()
    .refine((value) => !isNaN(parseFloat(value)) && parseFloat(value) > 0, {
      message: "Price must be a positive number",
    })
    .optional(),
  alcohol: number()
    .min(0, "Alcohol content must be at least 0%")
    .max(100, "Alcohol content cannot exceed 100%")
    .optional(),
  available: boolean().optional(),
  discount: number().min(0, "Discount must be at least 0").optional(),
  categoryId: objectId.optional(),
  translations: object({
    title: object({
      en: string().optional(),
      ge: string().optional(),
    }),
    description: object({
      en: string().optional(),
      ge: string().optional(),
    }),
    ingredients: object({
      en: array(string()).optional(),
      ge: array(string()).optional(),
    }),
  }).optional(),
});

// Define schemas that combine body, params, and query validations if needed
export const CreateCocktailSchema = object({
  body: createCocktailBody,
  params: object({}).optional(),
  query: object({}).optional(),
});

export const UpdateCocktailSchema = object({
  body: updateCocktailBody,
  params: object({ cocktailId: objectId }),
  query: object({}).optional(),
});

export const CocktailParamsSchema = object({
  body: object({}).optional(),
  params: object({ cocktailId: objectId }),
  query: object({}).optional(),
});

// Types for Create and Update
export type CreateCocktailInput = TypeOf<typeof CreateCocktailSchema>["body"];
export type UpdateCocktailInput = TypeOf<typeof UpdateCocktailSchema>["body"];
export type CocktailParamsInput = TypeOf<typeof CocktailParamsSchema>["params"];
