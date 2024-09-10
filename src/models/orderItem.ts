import mongoose from "mongoose";
import { OrderItemDocs } from "../dto/dto.order";

const OrderItem = new mongoose.Schema({
  title: { type: String },
  price: { type: Number },
  unit: { type: Number },
  image: { type: String },
});

const OrderItemModel = mongoose.model<OrderItemDocs>("OrderItems", OrderItem);

export default OrderItemModel;
