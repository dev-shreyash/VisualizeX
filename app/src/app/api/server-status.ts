import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

let serverStatus: string | null = null;

const fetchServerStatus = async () => {
  try {
    const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + "/status");
    serverStatus = response.data.status;
    console.log("Server status updated:", serverStatus);
  } catch (error:any) {
    console.error("Error fetching server status:", error.message);
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await fetchServerStatus(); // Fetch server status on demand
  res.status(200).json({ status: serverStatus || "Unknown" });
}
