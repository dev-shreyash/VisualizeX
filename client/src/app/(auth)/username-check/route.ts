import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const prisma = new PrismaClient();

const UsernameQuerySchema = z.object({
    username: usernameValidation,
});

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const queryParam = {
            username: searchParams.get("username"),
        };

        const result = UsernameQuerySchema.safeParse(queryParam);
        if (!result.success) {
            const usernameError = result.error.format().username?._errors || [];
            return new Response(
                JSON.stringify({ success: false, message: "Invalid username", usernameError }),
                { status: 400 }
            );
        }

        const { username } = result.data;

        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user) {
            return new Response(
                JSON.stringify({ success: true, message: "Username is available" }),
                { status: 200 }
            );
        } else {
            return new Response(
                JSON.stringify({ success: false, message: "Username is not available" }),
                { status: 400 }
            );
        }
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ success: false, message: "Something went wrong" }),
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
