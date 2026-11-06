import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { signServerAssertion } from "@/lib/serverToken";
import { checkRateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

const INTERNAL_API_URL = process.env.INTERNAL_API_URL || "http://localhost:5000";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "anonymous";

    const identifier = session?.user?.username || session?.user?.email || `ip:${ip}`;
    const rateLimitMax = session?.user ? 20 : 6; // 20 runs/min for authenticated, 6 for anon

    const rateCheck = checkRateLimit(identifier, rateLimitMax, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Please wait a moment before executing code again.",
          status: 429,
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil(rateCheck.resetMs / 1000).toString(),
          },
        }
      );
    }

    const body = await req.json();
    const { code, language, inputs } = body;

    if (!code || typeof code !== "string" || !language || typeof language !== "string") {
      return NextResponse.json(
        { error: "Code and language are required", status: 400 },
        { status: 400 }
      );
    }

    // Sign short-lived server assertion for internal Elysia worker
    const assertion = signServerAssertion({
      sub: identifier,
      role: session?.user?.role || "USER",
      scope: "code:execute",
    });

    const response = await fetch(`${INTERNAL_API_URL}/api/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${assertion}`,
      },
      body: JSON.stringify({
        code,
        language,
        inputs: typeof inputs === "string" ? inputs : "",
      }),
    });

    const data = await response.json().catch(() => ({ error: "Invalid worker response" }));
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Error in execute proxy:", error);
    return NextResponse.json(
      { error: "Execution service unavailable", status: 503 },
      { status: 503 }
    );
  }
}

