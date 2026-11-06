import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { signServerAssertion } from "@/lib/serverToken";

export const dynamic = "force-dynamic";

const INTERNAL_API_URL = process.env.INTERNAL_API_URL || "http://localhost:5000";

export async function GET(
  req: NextRequest,
  { params }: { params: { language: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.username) {
      return NextResponse.json(
        { error: "Unauthorized: Please sign in to fetch saved code" },
        { status: 401 }
      );
    }

    const { language } = params;
    if (!language) {
      return NextResponse.json(
        { error: "Language parameter is required" },
        { status: 400 }
      );
    }

    const username = session.user.username;
    const assertion = signServerAssertion({
      sub: username,
      role: session.user.role || "USER",
      scope: "code:read",
    });

    const response = await fetch(
      `${INTERNAL_API_URL}/api/code/${encodeURIComponent(username)}?language=${encodeURIComponent(
        language.toLowerCase()
      )}`,
      {
        headers: {
          Authorization: `Bearer ${assertion}`,
        },
      }
    );

    const data = await response.json().catch(() => null);
    if (response.ok) {
      return NextResponse.json(data, { status: 200 });
    } else {
      return NextResponse.json(
        { error: data?.error || "Failed to fetch code" },
        { status: response.status }
      );
    }
  } catch (error: any) {
    console.error("Error fetching user code:", error);
    return NextResponse.json(
      { error: "Error fetching saved code", details: error.message },
      { status: 500 }
    );
  }
}

