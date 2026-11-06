import { Elysia } from "elysia";
import { submitCode, getUserCode } from "../controllers/code.controllers";
import { verifyServerAssertion } from "../helper/s2sAuth";

interface CodeRequestBody {
  language: string;
  code: string;
  username: string;
}

export const codeRoutes = new Elysia()
  .post(
    "/api/code/submit",
    async ({
      body,
      headers,
      set,
    }: {
      body: CodeRequestBody;
      headers: Record<string, string | undefined>;
      set: { status?: number };
    }) => {
      const requireAuth = process.env.REQUIRE_S2S_AUTH !== "false";
      if (requireAuth) {
        const auth = verifyServerAssertion(headers["authorization"], "code:write");
        if (!auth.success) {
          set.status = auth.status;
          return { error: auth.error, status: auth.status };
        }
        // Assert ownership: token subject must match username or be admin
        if (auth.payload.role !== "ADMIN" && auth.payload.sub !== body.username) {
          set.status = 403;
          return { error: "Forbidden: Cannot save code for another user", status: 403 };
        }
      }

      const result = await submitCode(body);
      set.status = result.status;
      return result;
    }
  )
  .get(
    "/api/code/:username",
    async ({
      params,
      query,
      headers,
      set,
    }: {
      params: { username: string };
      query: { language?: string };
      headers: Record<string, string | undefined>;
      set: { status?: number };
    }) => {
      const { username } = params;
      const language = query.language;

      if (!language) {
        set.status = 400;
        return { error: "Language parameter is required", status: 400 };
      }

      const requireAuth = process.env.REQUIRE_S2S_AUTH !== "false";
      if (requireAuth) {
        const auth = verifyServerAssertion(headers["authorization"], "code:read");
        if (!auth.success) {
          set.status = auth.status;
          return { error: auth.error, status: auth.status };
        }
        // Assert ownership: token subject must match username or be admin
        if (auth.payload.role !== "ADMIN" && auth.payload.sub !== username) {
          set.status = 403;
          return { error: "Forbidden: Cannot access another user's saved code", status: 403 };
        }
      }

      const result = await getUserCode(username, language);
      set.status = result.status;
      return result;
    }
  );
