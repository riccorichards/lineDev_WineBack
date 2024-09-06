import mongoose from "mongoose";
import { object, string, z, TypeOf } from "zod";

// Custom ObjectId validation using Zod and Mongoose
export const objectId = z
  .string()
  .refine((value) => mongoose.Types.ObjectId.isValid(value), {
    message: "Invalid ObjectId",
  });

// Payload schema for creating a new address
const CreateAddressBody = object({
  // userId: objectId, // Using the custom ObjectId validation
  state: string({
    required_error: "State is required!",
  }).min(1, "State cannot be empty"), // Ensure non-empty string
  address1: string({
    required_error: "Address 1 is required!",
  }).min(1, "Address 1 cannot be empty"), // Ensure non-empty string
  address2: string().optional(),
  postalCode: string()
    .min(4, "Postal code should consist of at least 4 characters")
    .optional(), // Postal code is optional but must be at least 4 chars if provided
  city: string({
    required_error: "City is required!",
  }).min(1, "City cannot be empty"), // Ensure non-empty string
  country: string({
    required_error: "Country is required!",
  }).min(1, "Country cannot be empty"), // Ensure non-empty string
});

// Payload schema for updating an existing address
const UpdateAddressBody = object({
  // userId: objectId, // Using the custom ObjectId validation
  state: string().optional(), // Optional to allow partial updates
  address1: string().optional(), // Optional to allow partial updates
  address2: string().optional(), // Optional to allow partial updates
  postalCode: string()
    .min(4, "Postal code should consist of at least 4 characters")
    .optional(), // Optional but must meet minimum length if provided
  city: string().optional(), // Optional to allow partial updates
  country: string().optional(), // Optional to allow partial updates
});

// Params schema for route parameters (e.g., address ID in /update-address/:_id)
const ParamsSchema = object({
  _id: objectId, // Using the custom ObjectId validation
});

// Define schemas that combine body, params, and query validations if needed
export const CreateAddressSchema = object({
  body: CreateAddressBody, // Full body validation for creating an address
  params: object({}).optional(), // No specific params validation needed for creation
  query: object({}).optional(), // No specific query validation needed
});

export const UpdateAddressSchema = object({
  body: UpdateAddressBody, // Body validation allows partial updates
  params: object({}).optional(), // Params validation for updating an address by _id
  query: object({}).optional(), // No specific query validation needed
});

// TypeScript types for request validation
export type CreateAddressSchemaType = TypeOf<
  typeof CreateAddressSchema
>["body"]; // Type for CreateAddressSchema body
export type UpdateAddressSchemaType = TypeOf<
  typeof UpdateAddressSchema
>["body"]; // Type for UpdateAddressSchema, includes both body and params
export type AddressParamsType = TypeOf<typeof ParamsSchema>; // Type for AddressParams
