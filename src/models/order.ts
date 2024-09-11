import mongoose from "mongoose";
import { OrderDocs } from "../dto/dto.order";

const order = new mongoose.Schema(
  {
    customerId: { type: String },
    totalAmount: { type: Number },
    userAddress: { type: String },
    username: { type: String },
    email: { type: String },
    phone: { type: String },
    note: { type: String, default: null },
    paymentStatus: { type: String, enum: ["Pending", "Complete", "Reject"] },
    deliveryStatus: { type: String, enum: ["Pending", "Complete", "Reject"] },
    orderItems: [{ type: mongoose.Schema.Types.ObjectId, ref: "OrderItems" }],
  },
  { timestamps: true }
);

const OrderModel = mongoose.model<OrderDocs>("Orders", order);

export default OrderModel;
