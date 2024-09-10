import { boolean, number, object, string, TypeOf } from "zod";

// Define a custom ObjectId validation
const objectId = string().refine((value) => /^[0-9a-fA-F]{24}$/.test(value), {
  message: "Invalid ObjectId format",
});

// Define the schema for creating a new Wine (request body validation)
export const CreateWineSchema = object({
  body: object({
    image: string({
      required_error: "Image is Required!",
    }),
    price: number().min(1, "Price must be a positive number"),
    year: string()
      .refine((value) => /^\d{4}$/.test(value), {
        message: "Year must be a valid 4-digit number",
      })
      .optional(), // Ensures the year is a valid 4-digit number
    alcohol: number()
      .min(0, "Alcohol content must be at least 0%")
      .max(100, "Alcohol content cannot exceed 100%")
      .optional(), // Ensures the alcohol content is between 0 and 100%
    brand: string().optional(),
    available: boolean().optional(),
    discount: number().min(0, "Discount must be at least 0").optional(),
    categoryId: objectId, // Validates ObjectId
    titleTranslations: object({
      en: string({
        required_error: "Title in English is required",
      }),
      ge: string().optional(),
    }),
    descTranslations: object({
      en: string({
        required_error: "Description in English is required",
      }),
      ge: string().optional(),
    }),
    countryTranslations: object({
      en: string().optional(),
      ge: string().optional(),
    }).optional(),
    regionTranslations: object({
      en: string().optional(),
      ge: string().optional(),
    }).optional(),
    technologyTranslations: object({
      en: string().optional(),
      ge: string().optional(),
    }).optional(),
    familyCellarTranslations: object({
      en: string().optional(),
      ge: string().optional(),
    }).optional(),
    grapeVarietyTranslations: object({
      en: string().optional(),
      ge: string().optional(),
    }).optional(),
  }),
});

// Define the schema for updating an existing Wine (request body validation)
const updateWineBody = object({
  image: string().optional(),
  price: number().min(1, "Price must be a positive number").optional(), // Ensures the price, if provided, is a positive number
  year: string()
    .refine((value) => /^\d{4}$/.test(value), {
      message: "Year must be a valid 4-digit number",
    })
    .optional(), // Ensures the year, if provided, is a valid 4-digit number
  alcohol: number()
    .min(0, "Alcohol content must be at least 0%")
    .max(100, "Alcohol content cannot exceed 100%")
    .optional(), // Ensures the alcohol content, if provided, is between 0 and 100%
  brand: string().optional(),
  available: boolean().optional(),
  categoryId: objectId.optional(), // Validates ObjectId, if provided
  titleTranslations: object({
    en: string({
      required_error: "Title in English is required",
    }),
    ge: string().optional(),
  }).optional(),
  descTranslations: object({
    en: string({
      required_error: "Description in English is required",
    }),
    ge: string().optional(),
  }).optional(),
  countryTranslations: object({
    en: string().optional(),
    ge: string().optional(),
  }).optional(),
  regionTranslations: object({
    en: string().optional(),
    ge: string().optional(),
  }).optional(),
  technologyTranslations: object({
    en: string().optional(),
    ge: string().optional(),
  }).optional(),
  familyCellarTranslations: object({
    en: string().optional(),
    ge: string().optional(),
  }).optional(),
  grapeVarietyTranslations: object({
    en: string().optional(),
    ge: string().optional(),
  }).optional(),
});

// query validation
export const SearchQuerySchema = object({
  query: object({
    lang: string().refine((val) => val === "en" || val === "ge"),
    title: string().min(1, "Wine Title can't be less than 1 character."),
    flag: string().refine((val) => val === "wine" || val === "cocktail"),
  }),
});

export const FilterQuerySchema = object({
  query: object({
    target: string({ required_error: "Target flag is required." }).refine(
      (val) => val === "available" || val === "cheapest" || val === "latest"
    ),
  }),
});

export const UpdateWineSchema = object({
  body: updateWineBody,
  params: object({ wineId: objectId }),
});

export const WineParamsSchema = object({
  params: object({ wineId: objectId }),
});

export const PriceRangeQuerySchema = object({
  query: object({ minPrice: string(), maxPrice: string(), isWine: string() }),
});

export const PopularProductSchema = object({
  query: object({
    isWine: string(),
    page: string(),
  }),
});

export const RelativeProductsSchema = object({
  query: object({
    isWine: string(),
    page: string(),
  }),
  params: object({
    categoryId: string(),
  }),
});

export const ProductsStatsSchema = object({
  query: object({
    isWine: string(),
  }),
  params: object({
    productId: string(),
  }),
});

// Types for Create and Update
export type CreateWineInput = TypeOf<typeof CreateWineSchema>["body"];
export type UpdateWineInput = TypeOf<typeof UpdateWineSchema>["body"];
export type WineParamsInput = TypeOf<typeof WineParamsSchema>["params"];
export type SearchQueryInput = TypeOf<typeof SearchQuerySchema>["query"];
export type filterQueryInput = TypeOf<typeof FilterQuerySchema>["query"];
export type PriceRangeQueryInput = TypeOf<
  typeof PriceRangeQuerySchema
>["query"];
export type PopularQueryInput = TypeOf<typeof PopularProductSchema>["query"];
export type RelativeProductsInput = TypeOf<typeof RelativeProductsSchema>;
export type ProductsStatsInput = TypeOf<typeof ProductsStatsSchema>;
