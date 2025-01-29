import { NextResponse } from "next/server";
import axios from "axios";

// ✅ API Route (Handles POST Requests)
export async function POST(req: Request) {
  try {
    const { language, username, code } = await req.json();

    if (!language || !username || !code) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const payload = { language: language.toLowerCase(), username, code };

    // Send data to the backend API
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

// ✅ Client-Side Function (Call this from your React components)
export const saveCode = async (language: string, username: string, code: string) => {
  try {
    const response = await fetch("/api/saveCode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language, username, code }),
    });

    const data = await response.json();

    if (response.ok) {
      return { message: data.message };
    } else {
      throw new Error(data.error);
    }
  } catch (error: any) {
    return { error: "Error saving code", details: error.message };
  }
};
