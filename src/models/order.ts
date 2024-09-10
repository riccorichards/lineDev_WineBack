import mongoose from "mongoose";
import { OrderDocs } from "../dto/dto.order";

const order = new mongoose.Schema(
  {
    customerId: { type: String },
    productId: { type: String },
    totalAmount: { type: Number },
    orderItem: [{ type: mongoose.Schema.Types.ObjectId, ref: "OrderItem" }],
  },
  { timestamps: true }
);

const OrderModel = mongoose.model<OrderDocs>("Orders", order);

export default OrderModel;
