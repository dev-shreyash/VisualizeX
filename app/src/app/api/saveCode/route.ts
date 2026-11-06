import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { signServerAssertion } from "@/lib/serverToken";

export const dynamic = "force-dynamic";

const INTERNAL_API_URL = process.env.INTERNAL_API_URL || "http://localhost:5000";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.username) {
      return NextResponse.json(
        { error: "Unauthorized: Please sign in to save code" },
        { status: 401 }
      );
    }

    const { language, code } = await req.json();

    if (!language || typeof language !== "string" || !code || typeof code !== "string") {
      return NextResponse.json(
        { error: "Missing required language or code field" },
        { status: 400 }
      );
    }

    const username = session.user.username;
    const payload = {
      language: language.toLowerCase(),
      username,
      code,
    };

    const assertion = signServerAssertion({
      sub: username,
      role: session.user.role || "USER",
      scope: "code:write",
    });

    const response = await fetch(`${INTERNAL_API_URL}/api/code/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${assertion}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));
    if (response.ok) {
      return NextResponse.json(
        { message: "Code saved successfully!", code: data.code },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: data.error || "Failed to save code" },
        { status: response.status }
      );
    }
  } catch (error: any) {
    console.error("Error saving code:", error);
    return NextResponse.json(
      { error: "Error saving code", details: error.message },
      { status: 500 }
    );
  }
}
