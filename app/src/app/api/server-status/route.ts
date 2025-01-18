import { NextResponse } from "next/server";
import axios from "axios";

let serverStatus: string | null = null;

// Function to fetch server status
const fetchServerStatus = async () => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/status`);
    serverStatus = response.data.status;
    console.log("Server status updated:", serverStatus);
  } catch (error: any) {
    console.error("Error fetching server status:", error.message);
    serverStatus = "Error"; // Set status to "Error" if fetching fails
  }
};

// API route handler
export async function GET() {
  await fetchServerStatus(); // Fetch server status on demand
  return NextResponse.json({ status: serverStatus || "Unknown" });
}
