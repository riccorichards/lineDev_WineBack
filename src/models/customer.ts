import { CustomerDocs } from "../dto/dto.customer";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

//model for mongodb (user schema)
const CustomerSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, default: null },
    phone: { type: String },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
    url: { type: String, default: null },
    isAdmin: { type: Boolean, default: false },
    wishlist: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        }, // Reference to the Product schema
        title: { type: String, required: true },
        image: { type: String, required: true },
        url: { type: String, default: null },
        price: { type: Number, required: true },
      },
    ],
    cart: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        title: { type: String },
        image: { type: String },
        url: { type: String, required: false },
        price: { type: Number },
        unit: { type: Number, required: true },
      },
    ],
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  },
  {
    timestamps: true,
  }
);

//before we save the user's docs we are checking user's password
CustomerSchema.pre("save", async function (next) {
  const user = this;

  if (!user?.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(13);
    const hash = await bcrypt.hash(user?.password, salt);

    user.password = hash;
    return next();
  } catch (error: any) {
    return next(this.errors);
  }
});

CustomerSchema.methods.comparePass = async function (
  incomingPassword: string
): Promise<boolean> {
  try {
    const user = this as CustomerDocs;
    const isMatch = await bcrypt.compare(incomingPassword, user.password);
    return isMatch;
  } catch (error: any) {
    console.error({ err: error.message });
    return false;
  }
};

const CustomerModel = mongoose.model<CustomerDocs>("Customer", CustomerSchema);

export default CustomerModel;
