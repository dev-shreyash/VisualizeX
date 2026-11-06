import { Code } from "../models/code";

export const submitCode = async ({
  language,
  username,
  code,
}: {
  language: string;
  username: string;
  code: string;
}) => {
  if (!language || !username || typeof code !== "string") {
    return { error: "Language, username and code are required", status: 400 };
  }

  try {
    const normalizedLang = language.trim().toLowerCase();
    const normalizedUsername = username.trim();

    const updatedCode = await Code.findOneAndUpdate(
      { language: normalizedLang, username: normalizedUsername },
      { code },
      { new: true, upsert: true, runValidators: true }
    );

    return {
      message: "Code submitted successfully",
      code: updatedCode,
      status: 200,
    };
  } catch (error: any) {
    if (error.code === 11000) {
      return { error: "Duplicate code record conflict", status: 409 };
    }
    return {
      error: "Error submitting code",
      details: process.env.NODE_ENV === "development" ? error?.message : undefined,
      status: 500,
    };
  }
};

export const getUserCode = async (username: string, language: string) => {
  if (!username || !language) {
    return { error: "Username and language are required", status: 400 };
  }

  try {
    const normalizedLang = language.trim().toLowerCase();
    const normalizedUsername = username.trim();

    const record = await Code.findOne({
      username: normalizedUsername,
      language: normalizedLang,
    });

    if (!record) {
      return { code: null, status: 404 };
    }

    return { code: record, status: 200 };
  } catch (error: any) {
    return {
      error: "Failed to fetch user code",
      details: process.env.NODE_ENV === "development" ? error?.message : undefined,
      status: 500,
    };
  }
};
