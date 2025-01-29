import { Code } from "../models/code";

export const submitCode = async ({ language, username, code }: { language: string; username: string; code: string }) => {
    try {
      language = language.toLowerCase();
  
      const updatedCode = await Code.findOneAndUpdate(
        { language, username }, // Find existing record
        { code }, // Update the code field
        { new: true, upsert: true } // Return updated doc & create if not exists
      );
  
      console.log(`Code updated for ${username} in ${language}`);
      
      return { message: "Code submitted successfully", code: updatedCode };
    } catch (error: any) {
      return { error: "Error submitting code", details: error?.message };
    }
  };
  

export const getUserCode = async (username: string , language: string) => {
  try {
    console.log("code fetched of", username);

    return await Code.find({ username , language });
  } catch (error) {
    return { error: "Failed to fetch user's code" };
  }
};
