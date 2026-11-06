// server/src/controllers/codeExecution.ts
import {
  SandboxManager,
  SandboxCapacityError,
  SandboxValidationError,
  ExecutionResult,
} from "../Services/sandboxManager";
import { verifyServerAssertion } from "../helper/s2sAuth";

export interface ExecuteRequestBody {
  code: string;
  language: string;
  inputs?: string;
  timeoutMs?: number;
}

// Direct execution function for testing and internal service calls
export async function executeCode(
  code: string,
  language: string,
  inputs = "",
  timeoutMs?: number
): Promise<string> {
  const result = await SandboxManager.run(code, language, inputs, timeoutMs);
  if (result.timedOut) {
    throw new Error(`Execution time exceeded the limit of ${Math.round((timeoutMs || 3000) / 1000)} seconds`);
  }
  if (result.exitCode !== 0) {
    throw new Error(result.stderr || `Execution failed with exit code ${result.exitCode}`);
  }
  return result.stdout;
}

export const executeRouteHandler = async ({
  body,
  headers,
  set,
}: {
  body: ExecuteRequestBody;
  headers: Record<string, string | undefined>;
  set: { status?: number };
}) => {
  // If S2S authentication is enabled (default in production)
  const requireAuth = process.env.REQUIRE_S2S_AUTH !== "false";
  if (requireAuth) {
    const authResult = verifyServerAssertion(headers["authorization"], "code:execute");
    if (!authResult.success) {
      set.status = authResult.status;
      return { error: authResult.error, status: authResult.status };
    }
  }

  const { code, language, inputs, timeoutMs } = body || {};

  if (!code || !language) {
    set.status = 400;
    return { error: "Code and language are required", status: 400 };
  }

  try {
    const result: ExecutionResult = await SandboxManager.run(
      code,
      language,
      inputs || "",
      timeoutMs
    );

    if (result.timedOut) {
      set.status = 400;
      return {
        error: result.stderr,
        timedOut: true,
        wallTimeMs: result.wallTimeMs,
        status: 400,
      };
    }

    if (result.outputExceeded) {
      set.status = 413;
      return {
        error: result.stderr,
        outputExceeded: true,
        wallTimeMs: result.wallTimeMs,
        status: 413,
      };
    }

    if (result.exitCode !== 0) {
      set.status = 400;
      return {
        error: result.stderr || `Process exited with code ${result.exitCode}`,
        stdout: result.stdout,
        exitCode: result.exitCode,
        wallTimeMs: result.wallTimeMs,
        status: 400,
      };
    }

    set.status = 200;
    return {
      result: result.stdout,
      stdout: result.stdout,
      stderr: result.stderr,
      exitCode: 0,
      wallTimeMs: result.wallTimeMs,
      status: 200,
    };
  } catch (err: any) {
    if (err instanceof SandboxValidationError) {
      set.status = 422;
      return { error: err.message, status: 422 };
    }

    if (err instanceof SandboxCapacityError) {
      set.status = 503;
      return { error: err.message, status: 503 };
    }

    set.status = 500;
    return {
      error: "An unexpected error occurred during execution",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
      status: 500,
    };
  }
};
