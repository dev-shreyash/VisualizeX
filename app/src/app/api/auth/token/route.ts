import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { error: "Endpoint deprecated for security reasons" },
    { status: 404 }
  );
}
