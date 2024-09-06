import mongoose from "mongoose";
import { AddressDocument } from "../dto/dto.address";

const address = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "Customer" },
    address1: { type: String },
    address2: { type: String },
    postalCode: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
  },
  { timestamps: true }
);

const AddressModel = mongoose.model<AddressDocument>("Address", address);

export default AddressModel;