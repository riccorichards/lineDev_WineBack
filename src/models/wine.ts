import mongoose from "mongoose";
import { WineDocs } from "../dto/dto.wine";

const Wine = new mongoose.Schema(
  {
    // Fields that don't need translation
    image: { type: String },
    url: { type: String },
    price: { type: String },
    year: { type: String },
    alcohol: { type: Number },
    brand: { type: String },
    available: { type: Boolean },
    titleTranslations: {
      en: { type: String, required: true },
      ge: { type: String, required: true },
    },
    descTranslations: {
      en: { type: String, required: true },
      ge: { type: String, required: true },
    },
    countryTranslations: {
      en: { type: String, required: true },
      ge: { type: String, required: true },
    },
    regionTranslations: {
      en: { type: String, required: true },
      ge: { type: String, required: true },
    },
    technologyTranslations: {
      en: { type: String, required: true },
      ge: { type: String, required: true },
    },
    familyCellarTranslations: {
      en: { type: String, required: true },
      ge: { type: String, required: true },
    },
    grapeVarietyTranslations: {
      en: { type: String, required: true },
      ge: { type: String, required: true },
    },
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

const WineModel = mongoose.model<WineDocs>("Wine", Wine);

export default WineModel;
