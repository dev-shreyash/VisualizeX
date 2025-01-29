import mongoose from "mongoose";
import "dotenv/config";

const MONGO_URI = process.env.MONGODB_URL || "";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      dbName: "CODES", // Change to your DB name
    });
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};
