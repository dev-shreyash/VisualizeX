import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { dbPrimary } from "@/app/lib/database/primary-database";
import bcrypt from "bcryptjs";



export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();

    //CHECK EXISTING USER
    const existingUserByUsername = await dbPrimary.user.findUnique({
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

    const existingUserByEmail = await dbPrimary.user.findUnique({
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

    //PASS HASHING
    const hashedPass = await bcrypt.hash(password, 10);

    //CREATE NEW USER
    const newUser = await dbPrimary.user.create({
      data: {
        username,
        email,
        password: hashedPass,
      }
    });


    return Response.json(
      {
        success: true,
        data:newUser,
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