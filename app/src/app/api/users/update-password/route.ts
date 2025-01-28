import { db } from "@/app/lib/database/database";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { username, newPassword, password: oldPassword } = await req.json();

    // Find the user by username
    const user = await db.user.findUnique({
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
      

    // Verify the old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      return Response.json(
        {
          success: false,
          message: "Invalid old password",
        },
        { status: 401 }
      );
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    const updatedUser = await db.user.update({
      where: { username },
      data: { password: hashedNewPassword },
    });

    return Response.json(
      {
        success: true,
        data: updatedUser,
        message: "Password updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating password", error);
    return Response.json(
      {
        success: false,
        message: "Error updating password",
      },
      { status: 500 }
    );
  }
}
