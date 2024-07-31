import { db } from "@/app/lib/database/database";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      username: searchParams.get("username"),
    };

    // Zod validation
    const result = UsernameQuerySchema.safeParse(queryParams);
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return new Response(
        JSON.stringify({
          success: false,
          message: "Invalid username",
          usernameErrors,
        }),
        { status: 400 }
      );
    }

    const { username } = result.data;

    // Prisma query to check if username exists
    const user = await db.user.findFirst({
      where: { username }
    });

    if (!user) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "Username is available",
        }),
        { status: 200 }
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Username is not available",
        }),
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error checking username:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Something went wrong",
      }),
      { status: 500 }
    );
  }
}
