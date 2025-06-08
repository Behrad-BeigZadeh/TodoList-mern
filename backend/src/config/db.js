import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from "../lib/logger.js";
dotenv.config();
export const connectDb = async () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      logger.info("Connected to mongoDB");
    })
    .catch((err) => {
      logger.error(`DB Connection Error: ${err}`);
    });
};
