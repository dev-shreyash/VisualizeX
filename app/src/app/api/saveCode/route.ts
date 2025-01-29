import { NextResponse } from "next/server";
import axios from "axios";

// ✅ Handles API POST request to save code
export async function POST(req: Request) {
  try {
    const { language, username, code } = await req.json();

    if (!language || !username || !code) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const payload = { language: language.toLowerCase(), username, code };

    // Send to external API
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/code/submit`, payload);

    if (response.status === 200) {
      return NextResponse.json({ message: "Code saved successfully!" }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Failed to save code" }, { status: response.status });
    }
  } catch (error: any) {
    return NextResponse.json({ error: "Error saving code", details: error.message }, { status: 500 });
  }
}
