import { Elysia } from "elysia";
import { submitCode, getUserCode } from "../controllers/code.controllers";


interface CodeRequestBody {
    language: string;
    code: string;
    username: string;
  }

  
export const codeRoutes = new Elysia()
  .post("/api/code/submit", async ({ body }:{body:CodeRequestBody}) => await submitCode(body))
  .get("/api/code/:username", async ({ params, query }: { params: { username: string }, query: { language: string } }) => {
    const { username } = params;
    const { language } = query;
    if (!language) return { error: "Language parameter is required" };
    return await getUserCode(username, language);
});
