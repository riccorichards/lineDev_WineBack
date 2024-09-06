import mongoose from "mongoose";
import { CustomerDocs } from "./dto.customer";

export interface SessionDocument extends mongoose.Document {
  user: CustomerDocs["_id"];
  valid: boolean;
  userAgent: string;
  admin: boolean;
  createAt: Date;
  updateAt: Date;
}
