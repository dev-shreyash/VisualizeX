import { Schema, model } from "mongoose";

const codeSchema = new Schema(
  {
    language: { type: String, required: true },
    username: { type: String, required: true, },
    code: { type: String, required: true },
  },
  { timestamps: true }
);

export const Code = model("User", codeSchema);
