import mongoose from "mongoose";

//address input type
export interface AddressInputType {
  userId: string;
  address1: string;
  address2: string | null;
  postalCode: string;
  state: string;
  city: string;
  country: string;
}

//address document type
export interface AddressDocument extends AddressInputType, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}



export interface UpdateAddressInput {
  state: string;
  address1: string;
  address2: string;
  postalCode: string;
  city: string;
  country: string;
}