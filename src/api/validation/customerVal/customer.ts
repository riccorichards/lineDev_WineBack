import { object, string, TypeOf } from "zod";

// Validation schema for the request body when creating a customer
const CreateCustomerBody = object({
  username: string({
    required_error: "Username is required!",
  }),
  email: string({
    required_error: "Email is required!",
  }).email("Invalid email format!"),
  phone: string()
    .min(9, "Phone number is too short!")
    .max(15, "Phone number is too long!"),
  password: string({
    required_error: "Password is required!",
  }).min(8, "Password is too short - should be 8 characters minimum."),
  confirmPassword: string({
    required_error: "Confirm password is required!",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match!",
  path: ["confirmPassword"],
});

// Validation schema for the request body when updating a customer
const UpdateCustomerBody = object({
  username: string().optional(), // Optional to allow updates to specific fields
  email: string().email("Invalid email format!").optional(),
  phone: string()
    .min(9, "Phone number is too short!")
    .max(15, "Phone number is too long!")
    .optional(),
  image: string().url("Invalid URL format").nullable().optional(),
  password: string()
    .min(8, "Password is too short - should be 8 characters minimum.")
    .optional(),
  confirmPassword: string().optional(),
}).refine(
  (data) => {
    if (data.password || data.confirmPassword) {
      return data.password === data.confirmPassword;
    }
    return true;
  },
  {
    message: "Passwords do not match!",
    path: ["confirmPassword"],
  }
);

// Define schemas that combine body, params, and query validations if needed
export const CreateCustomerSchema = object({
  body: CreateCustomerBody,
  params: object({}).optional(),
  query: object({}).optional(),
});

export const UpdateCustomerSchema = object({
  params: object({}).optional(),
  body: UpdateCustomerBody,
  query: object({}).optional(),
});

export const InPerionQuerySchema = object({
  query: object({
    inPeriod: string().refine(
      (v) => v === "day" || v === "week" || v === "month"
    ),
  }),
});

export const UpdateAdminStatusQuery = object({
  query: object({
    email: string({ required_error: "Email is Required." }),
  }),
});

// TypeScript types for request validation
export type CreateCustomerSchemaType = Omit<
  TypeOf<typeof CreateCustomerSchema>["body"],
  "confirmPassword"
>; // Omit confirmPassword from the CreateCustomerSchemaType

export type UpdateCustomerSchemaType = TypeOf<
  typeof UpdateCustomerSchema
>["body"]; // Type for UpdateCustomerSchema

export type InPeriodQueryType = TypeOf<typeof InPerionQuerySchema>["query"];
export type UpdateAdminStatusType = TypeOf<
  typeof UpdateAdminStatusQuery
>["query"];
