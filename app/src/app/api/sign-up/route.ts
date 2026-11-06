import { db } from "@/app/lib/database/database";
import bcrypt from "bcryptjs";
import { signUpSchema } from "@/schemas/signUpSchema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parseResult = signUpSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: parseResult.error.errors.map((e) => e.message).join(", "),
        },
        { status: 400 }
      );
    }

    const { username, email, password } = parseResult.data;

    // CHECK EXISTING USER BY USERNAME
    const existingUserByUsername = await db.user.findUnique({
      where: { username },
    });

    if (existingUserByUsername) {
      return NextResponse.json(
        {
          success: false,
          message: "Username already taken",
        },
        { status: 400 }
      );
    }

    // CHECK EXISTING USER BY EMAIL
    const existingUserByEmail = await db.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "User already exists with this email",
        },
        { status: 400 }
      );
    }

    // HASH PASSWORD
    const hashedPass = await bcrypt.hash(password, 10);

    // CREATE NEW USER (EXCLUDING PASSWORD FROM SELECT)
    const newUser = await db.user.create({
      data: {
        username,
        email,
        password: hashedPass,
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: newUser,
        message: "User registered successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error registering user",
      },
      { status: 500 }
    );
  }
}
