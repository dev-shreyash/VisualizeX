// server/src/controllers/codeExecution.ts
import type { Handler } from "elysia";
import {SandboxManager} from "../Services/sandboxManager";

type ExecuteHandler = Handler<{
  body: {
    code: string;
    language: string;
    inputs?: string;
  };
}>;

export const executeRouteHandler: ExecuteHandler = async ({ body }) => {
  const { code, language, inputs } = body;
  if (!code || !language) {
    return { error: "Code and language are required", status: 400 };
  }

  try {
    const result = await SandboxManager.run(code, language, inputs);
    if (result.timedOut || result.exitCode !== 0) {
      return {
        error: result.stderr || "Execution failed or timed out",
        wallTimeMs: result.wallTimeMs,
        status: 400,
      };
    }
    return {
      result: result.stdout,
      wallTimeMs: result.wallTimeMs,
      status: 200,
    };
  } catch (err: any) {
    return { error: err.message || "Sandbox error", status: 500 };
  }
};