import { NextResponse } from "next/server";
import { dbPrimary } from "@/app/lib/database/primary-database";

// Fetch all users
export async function GET() {
  try {
    const users = await dbPrimary.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

// Delete a user
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    console.log(id);

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    await dbPrimary.user.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}

// Update user details (username and email)
export async function PATCH(request: Request) {
  try {
    const { id, username, email } = await request.json();

    if (!id || (!username && !email)) {
      return NextResponse.json(
        { error: "User ID and at least one field to update are required" },
        { status: 400 }
      );
    }

    const updatedUser = await dbPrimary.user.update({
      where: { id: parseInt(id) },
      data: {
        ...(username && { username }),
        ...(email && { email }),
      },
    });

    return NextResponse.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

// Update user role
export async function PUT(request: Request) {
  try {
    const { id, role } = await request.json();

    if (!id || !role) {
      return NextResponse.json({ error: "User ID and role are required" }, { status: 400 });
    }

    const updatedUser = await dbPrimary.user.update({
      where: { id: parseInt(id) },
      data: { role },
    });

    return NextResponse.json({ message: "User role updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json({ error: "Failed to update user role" }, { status: 500 });
  }
}
