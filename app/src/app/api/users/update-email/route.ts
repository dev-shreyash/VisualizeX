import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { db } from "@/app/lib/database/database";
import bcrypt from "bcryptjs";
import { updateEmailSchema } from "@/schemas/userSchemas";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.username) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Please sign in" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parseResult = updateEmailSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: parseResult.error.errors.map((e) => e.message).join(", "),
        },
        { status: 400 }
      );
    }

    const { email: newEmail, password } = parseResult.data;
    const username = session.user.username;

    // Find the user by verified session username
    const user = await db.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (!user.password) {
      return NextResponse.json(
        { success: false, message: "OAuth accounts cannot change password/email via this method" },
        { status: 400 }
      );
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid password" },
        { status: 401 }
      );
    }

    // Check if the new email is already in use
    const existingUserByEmail = await db.user.findUnique({
      where: { email: newEmail },
    });

    if (existingUserByEmail && existingUserByEmail.id !== user.id) {
      return NextResponse.json(
        { success: false, message: "Email already in use" },
        { status: 400 }
      );
    }

    // Update the user's email, selecting only non-sensitive fields
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: { email: newEmail },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: updatedUser,
        message: "Email updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating email:", error);
    return NextResponse.json(
      { success: false, message: "Error updating email" },
      { status: 500 }
    );
  }
}
