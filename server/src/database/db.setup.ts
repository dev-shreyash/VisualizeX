import mongoose from "mongoose";
import "dotenv/config";

const MONGO_URI = process.env.MONGODB_URL;

export const connectDB = async (): Promise<void> => {
  if (!MONGO_URI) {
    console.error("❌ MONGODB_URL environment variable is missing.");
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
    return;
  }

  try {
    await mongoose.connect(MONGO_URI, {
      dbName: process.env.MONGODB_DB_NAME || "CODES",
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log("MongoDB Disconnected cleanly");
    }
  } catch (error) {
    console.error("Error disconnecting MongoDB:", error);
  }
};
