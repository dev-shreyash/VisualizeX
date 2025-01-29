import axios from "axios";

// Function to save code to the backend API
export const saveCode = async (language: string, username: string, code: string) => {
  try {
    // Prepare the data to send in the POST request
    const payload = {
      language: language.toLowerCase(),  // Ensure language is in lowercase
      username: username,
      code: code,
    };

    // Make the POST request to save the code
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/code/submit`, payload);

    // Handle success response
    if (response.status === 200) {
      console.log("Code saved successfully!");
      return { message: "Code saved successfully!" };
    } else {
      throw new Error("Failed to save code");
    }
  } catch (error: any) {
    // Handle error response
    console.error("Error saving code:", error.message);
    return { error: "Error saving code", details: error.message };
  }
};
