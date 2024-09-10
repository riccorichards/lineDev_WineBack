import mongoose from "mongoose";
import { MongooseTypeObject } from "./dto.customer";

export interface OrderItemInputType {
  title: string;
  image: string;
  price: number;
  unit: number;
}

export interface OrderItemDocs extends OrderItemInputType, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderInputType {
  customerId: string;
  totalAmount: number;
  orderItem: MongooseTypeObject[];
  paymentStatus: "Pending" | "Complete" | "Reject";
}

export interface OrderDocs extends OrderInputType, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}
