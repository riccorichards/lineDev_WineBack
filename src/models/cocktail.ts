import mongoose from "mongoose";
import { CocktailDocs } from "../dto/dto.cocktails";

const Cocktail = new mongoose.Schema(
  {
    // Fields that don't need translation
    image: { type: String },
    url: { type: String },
    price: { type: Number },
    alcohol: { type: Number },
    discount: { type: Number },
    available: { type: Boolean },
    titleTranslations: { en: { type: String }, ge: { type: String } },
    descTranslations: { en: { type: String }, ge: { type: String } },
    ingsTranslations: { en: [{ type: String }], ge: [{ type: String }] },
    categoryId: { type: mongoose.Types.ObjectId, ref: "Category" },
    feedback: [{ type: mongoose.Types.ObjectId, ref: "Feedback" }],
    sumRate: { type: Number, default: 0 },
    lenRate: { type: Number, default: 0 },
    avgRate: { type: Number, default: 0 },
    clickCount: { type: Number, default: 0 },
    cartCount: { type: Number, default: 0 },
    wishlistCount: { type: Number, default: 0 },
    orderCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const CocktailModel = mongoose.model<CocktailDocs>("Cocktail", Cocktail);

export default CocktailModel;
