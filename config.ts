import dotenv from "dotenv";
dotenv.config();

export default {
  port: 8001,
  origin: "http://localhost:5173",
  rsaPrivateKey: process.env["RSA_PRIVATE_KEY"],
  rsaPublicKey: process.env["RSA_PUBLIC_KEY"],
  mongo_dev_url: process.env["MONGO_DEVELOPMENT_URL"],
};