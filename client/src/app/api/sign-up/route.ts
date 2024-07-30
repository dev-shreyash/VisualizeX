import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    const existingUserByUsername = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUserByUsername) {
      return Response.json(
        {
          success: false,
          message: 'Username already taken'
        },
        {
          status: 400
        }
      );
    }

    const existingUserByEmail = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUserByEmail) {
      return Response.json(
        {
          success: false,
          message: 'User already exists with this email'
        },
        {
          status: 400
        }
      );
    }

    const hashedPass = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPass,
      }
    });


    return Response.json(
      {
        success: true,
        message: 'User registered successfully'
      },
      {
        status: 200
      }
    );
  } catch (error) {
    console.error('Error registering user', error);
    return Response.json(
      {
        success: false,
        message: 'Error registering user'
      },
      {
        status: 500
      }
    );
  }
}
