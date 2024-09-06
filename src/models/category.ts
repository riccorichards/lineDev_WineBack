import mongoose from "mongoose";
import { CategoryDoc } from "../dto/dto.category";

const categorySchema = new mongoose.Schema(
  {
    titleTranslations: {
      en: { type: String, required: true },
      ge: { type: String, required: true },
    },
    parentId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Category",
      default: null, // Root categories will have null parentId
    },
    type: {
      type: String,
      enum: ["wine", "cocktail"], // Assuming a category can only be for wine or cocktail
      required: true,
    },
    subCategories: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Category",
        default: [],
      },
    ],
    products: [
      {
        productId: {
          type: mongoose.SchemaTypes.ObjectId,
          required: true,
        },
        productType: {
          type: String,
          enum: ["wine", "cocktail"],
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const CategoryModel = mongoose.model<CategoryDoc>("Category", categorySchema);

export default CategoryModel;
