import mongoose from "mongoose";

export interface OrderItemInputType {
    userId: string;
    productId: string;
    title: string;
    image: string;
    url: null | string;
    price: string;
    unit: number;
  }

export interface OrderItemDocs extends OrderItemInputType, mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
  }


export interface OrderInputType {
    customerId: string;
    productId: string;
    totalAmount: number;
    orderItem: OrderInputType[];
  }

export interface OrderDocs extends OrderInputType, mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
  }
