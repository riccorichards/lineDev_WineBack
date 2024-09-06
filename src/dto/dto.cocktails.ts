import mongoose from "mongoose";
import { MongooseTypeObject } from "./dto.customer";

// Define CocktailInputType based on the CreateCocktailSchema
export interface CocktailInputType {
  // Core fields
  image: string;
  url: string | null;
  price: string;
  alcohol?: number;
  available?: boolean;
  discount?: number;
  titleTranslations: { en?: string; ge?: string };
  descTranslations: { en?: string; ge?: string };
  ingsTranslations: { en?: string[]; ge?: string[] };
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

// UpdateCocktailInputType based on the UpdateCocktailSchema
export interface UpdateCocktailInputType {
  image?: string;
  url?: string | null;
  price?: string;
  alcohol?: number;
  available?: boolean;
  discount?: number;
  titleTranslations?: { en?: string; ge?: string };
  descTranslations?: { en?: string; ge?: string };
  ingsTranslations?: { en?: string[]; ge?: string[] };
  categoryId?: MongooseTypeObject;
  lenRate?: number;
  sumRate?: number;
  avgRate?: number | null;
  clickCount?: number;
  cartCount?: number;
  wishlistCount?: number;
  orderCount?: number;
}

// Mongoose Document Interface
export interface CocktailDocs extends CocktailInputType, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}
