import dotenv from "dotenv";
import mongoose from "mongoose";
import config from "../../config";
dotenv.config();

const db = async () => {
  const mongo_Url = config.mongo_dev_url || "";
  try {
    await mongoose.connect(mongo_Url);
    console.info("Connected with mongoDb at locally...");
  } catch (error: any) {
    console.error(error.message);
    process.exit(1);
  }
};

export default db;
