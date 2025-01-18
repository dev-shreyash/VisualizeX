import { dbPrimary } from "@/app/lib/database/primary-database";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();
    console.log(username, email, password);

    const newEmail = email;

    // Find the user by username
    const user = await dbPrimary.user.findUnique({
      where: { username },
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    if (user.password === null) {
        return Response.json(
          {
            success: false,
            message: "User password not found",
          },
          { status: 404 }
        );
      }
      
    

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return Response.json(
        {
          success: false,
          message: "Invalid password",
        },
        { status: 401 }
      );
    }

    // Check if the new email is already in use
    const existingUserByEmail = await dbPrimary.user.findUnique({
      where: { email: newEmail },
    });

    if (existingUserByEmail) {
      return Response.json(
        {
          success: false,
          message: "Email already in use",
        },
        { status: 400 }
      );
    }

    // Update the user's email
    const updatedUser = await dbPrimary.user.update({
      where: { username },
      data: { email: newEmail },
    });

    return Response.json(
      {
        success: true,
        data: updatedUser,
        message: "Email updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating email", error);
    return Response.json(
      {
        success: false,
        message: "Error updating email",
      },
      { status: 500 }
    );
  }
}
