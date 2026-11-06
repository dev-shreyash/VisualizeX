import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { db } from "@/app/lib/database/database";

export const dynamic = "force-dynamic";

async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  if (session.user.role !== "ADMIN") {
    return { error: NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 }) };
  }
  return { session };
}

// Fetch all users (Admin only)
export async function GET() {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { id: "asc" },
    });
    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

// Delete a user (Admin only)
export async function DELETE(request: Request) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // Prevent deleting oneself
    if (auth.session.user.id && userId === Number(auth.session.user.id)) {
      return NextResponse.json({ error: "Cannot delete the active admin account" }, { status: 400 });
    }

    await db.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}

// Update user details (username and email) (Admin only)
export async function PATCH(request: Request) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  try {
    const { id, username, email } = await request.json();

    if (!id || (!username && !email)) {
      return NextResponse.json(
        { error: "User ID and at least one field to update are required" },
        { status: 400 }
      );
    }

    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        ...(username && { username }),
        ...(email && { email }),
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

// Update user role (Admin only)
export async function PUT(request: Request) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  try {
    const { id, role } = await request.json();

    if (!id || !role || (role !== "USER" && role !== "ADMIN")) {
      return NextResponse.json({ error: "User ID and valid role (USER or ADMIN) are required" }, { status: 400 });
    }

    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ message: "User role updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json({ error: "Failed to update user role" }, { status: 500 });
  }
}
