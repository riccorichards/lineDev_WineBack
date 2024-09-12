import mongoose from "mongoose";
import { MongooseTypeObject } from "./dto.customer";

export interface OrderItemInputType {
  customerId: string;
  productId: string;
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
  userAddress: string;
  email: string;
  phone: string;
  note?: string;
  orderItems: MongooseTypeObject[];
  paymentStatus: "Pending" | "Complete" | "Reject";
  deliveryStatus: "Pending" | "Complete" | "Reject";
}

export interface OrderDocs extends OrderInputType, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}
