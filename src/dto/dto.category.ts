import mongoose from "mongoose";
import { MongooseTypeObject } from "./dto.customer";

export interface CategoryInputType {
  titleTranslations?: { en?: string; ge?: string };
  parentId?: MongooseTypeObject;
  type: "wine" | "cocktail";
  subCategories: MongooseTypeObject[];
  products: [
    {
      productId: MongooseTypeObject;
      productType: "wine" | "cocktail";
    }
  ];
}

export interface UpdateCategoryInputType {
  titleTranslations?: { en?: string; ge?: string };
  catId: string;
}

export interface AddItemInCatType {
  catId: string;
  products: string[];
}

export interface CategoryDoc extends CategoryInputType, mongoose.Document {
  _id: MongooseTypeObject;
  createdAt: Date;
  updatedAt: Date;
}
