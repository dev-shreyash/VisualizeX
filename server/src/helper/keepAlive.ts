import { Code } from "../models/code";

export const keepServerAlive = () => {
  setInterval(async () => {
    try {
      console.log("Pinging database to keep server alive...");

      // Get current date and timestamp
      const now = new Date();
      const formattedDate = now.toISOString(); // Example: 2025-02-15T12:34:56.789Z

      // Update the document with current timestamp
      await Code.findByIdAndUpdate(
        "6799bf00c6059d0186937f92", // Specific document ID
        { code: `console.log('Server is alive - ${formattedDate}');` }, // Append timestamp
        { new: true } // Return updated document
      );

      console.log(`Database ping successful at ${formattedDate}`);
    } catch (error) {
      console.error("Database ping failed:", error);
    }
  }, 1000 * 60* 60); // Runs every  once a day

};
