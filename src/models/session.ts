import mongoose from "mongoose";
import { SessionDocument } from "../dto/dto.session";

const session = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "User" },
    valid: { type: Boolean, default: true },
    admin: { type: Boolean },
    userAgent: { type: String },
  },
  { timestamps: true }
);

const SessionModel = mongoose.model<SessionDocument>("Session", session);

export default SessionModel;
