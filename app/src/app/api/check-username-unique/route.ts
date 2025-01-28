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
      username: searchParams.get('username'),
    };

    const result = UsernameQuerySchema.safeParse(queryParams);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return new Response(
        JSON.stringify({
          success: false,
          message: usernameErrors?.length > 0
            ? usernameErrors.join(', ')
            : 'Invalid query parameters',
        }),
        { status: 400 }
      );
    }

    const { username } = result.data;

    const existingUser = await db.user.findFirst({
      where: {
        username: username,
      }
    });

    if (existingUser) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Username is already taken',
        }),
        { status: 200 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Username is unique',
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking username:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error checking username',
      }),
      { status: 500 }
    );
  }
}
