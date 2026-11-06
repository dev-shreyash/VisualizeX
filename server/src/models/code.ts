import { Schema, model } from "mongoose";

export interface ICode {
  language: string;
  username: string;
  code: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const codeSchema = new Schema<ICode>(
  {
    language: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Compound unique index ensuring one saved code record per user and language
codeSchema.index({ username: 1, language: 1 }, { unique: true });

// CRITICAL DATA PRESERVATION:
// Mongoose originally registered model("User", codeSchema) which defaulted to the "users" collection.
// To preserve 100% of existing documents and prevent data loss, the collection name defaults to "users".
// An administrator can explicitly set MONGODB_CODE_COLLECTION="codes" after running the migration script.
const collectionName = process.env.MONGODB_CODE_COLLECTION || "users";

export const Code = model<ICode>("Code", codeSchema, collectionName);
