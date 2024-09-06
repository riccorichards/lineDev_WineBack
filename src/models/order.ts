import mongoose from "mongoose";
import { CartDocs } from "../dto/dto.comment";

const order = new mongoose.Schema(
  {
    customerId: { type: String },
    productId: { type: String },
    totalAmount: { type: Number },
    orderItem: [{ type: mongoose.Schema.Types.ObjectId, ref: "OrderItem" }],
  },
  { timestamps: true }
);

const OrderModel = mongoose.model<CartDocs>("OrderItem", order);

export default OrderModel;
