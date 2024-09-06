import mongoose from "mongoose";
import { MongooseTypeObject } from "./dto.customer";

// Define WineInputType based on the CreateWineSchema
export interface WineInputType {
  // Core fields
  image: string;
  url: string | null;
  price: string;
  year?: string;
  alcohol?: number;
  brand?: string;
  available?: boolean;
  discount?: number;
  titleTranslations: { en?: string; ge?: string };
  descTranslations: { en?: string; ge?: string };
  countryTranslations: { en?: string; ge?: string };
  regionTranslations: { en?: string; ge?: string };
  technologyTranslations: { en?: string; ge?: string };
  familyCellarTranslations: { en?: string; ge?: string };
  grapeVarietyTranslations: { en?: string; ge?: string };
  categoryId: MongooseTypeObject;
  feedback: MongooseTypeObject[];
  lenRate: number;
  sumRate: number;
  avgRate: number | null;
  clickCount: number;
  cartCount: number;
  wishlistCount: number;
  orderCount: number;
}

// UpdateWineInputType based on the UpdateWineSchema
export interface UpdateWineInputType {
  image?: string;
  url?: string | null;
  price?: string;
  year?: string;
  alcohol?: number;
  brand?: string;
  available?: boolean;
  discount?: number;
  titleTranslations: { en?: string; ge?: string };
  descTranslations: { en?: string; ge?: string };
  countryTranslations: { en?: string; ge?: string };
  regionTranslations: { en?: string; ge?: string };
  technologyTranslations: { en?: string; ge?: string };
  familyCellarTranslations: { en?: string; ge?: string };
  categoryId?: MongooseTypeObject;
}

// Mongoose Document Interface
export interface WineDocs extends WineInputType, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

export interface FilterQueriesType {
  year?: string;
  region?: string;
  country?: string;
  technology?: string;
  alcohol?: string;
  brand?: string;
  price?: string;
  familyCellar?: string;
  grapesVariety?: string;
  available?: string;
}
