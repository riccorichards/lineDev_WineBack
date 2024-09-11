import mongoose from "mongoose";

export type MongooseTypeObject = mongoose.Types.ObjectId;

export interface PopulateAddress {
  userId: string;
  state: string;
  address1: string;
  address2: string;
  postalCode: string;
  city: string;
  country: string;
}

export interface CustomerInput {
  image: string;
  url: string;
  username: string;
  email: string;
  password: string;
  salt: string;
  phone: string;
  address: MongooseTypeObject | PopulateAddress;
  isAdmin: boolean;
  wishlist: WishlistType[];
  feedback: MongooseTypeObject[];
  cart: CartType[];
}

//document model for user in mongodb
export interface CustomerDocs extends CustomerInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
  comparePass(incomingPassword: string): Promise<boolean>;
}

export interface CartType {
  userId: string;
  productId: string;
  title: string;
  image: string;
  url: null | string;
  price: number;
  unit: number;
  productType: "wine" | "cocktail";
}

//login type
export interface LoginInputType {
  email: string;
  password: string;
}

//for update profile
export interface UpdateUserInput {
  username: string;
  email: string;
  newPassword: string;
}

export interface WishlistType {
  productId: string;
  title: string;
  image: string;
  url: null | string;
  price: number;
  productType: "wine" | "cocktail";
}

export interface SessionInputType {
  email: string;
  password: string;
}

export interface UploadFileType {
  type: string;
  title: string;
  userId: string;
}
