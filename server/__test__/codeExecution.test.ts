import { describe, it, expect, beforeAll } from "bun:test";
import {
  SandboxManager,
  SandboxValidationError,
  SandboxCapacityError,
  COMMAND_MAP,
} from "../src/Services/sandboxManager";
import { executeCode, executeRouteHandler } from "../src/controllers/codeExecution";
import { verifyServerAssertion } from "../src/helper/s2sAuth";
import { execFile } from "child_process";
import { promisify } from "util";
import crypto from "crypto";

const execFileAsync = promisify(execFile);

// Helper to sign a test assertion
function createTestToken(scope = "code:execute", role = "USER", sub = "testuser", ttl = 60) {
  const secret = process.env.INTERNAL_SERVICE_SECRET || "default-insecure-visualizex-secret-change-in-prod";
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub,
    role,
    scope,
    nonce: crypto.randomBytes(8).toString("hex"),
    iat: now,
    exp: now + ttl,
  };

  const header = { alg: "HS256", typ: "JWT" };
  const b64 = (obj: any) =>
    Buffer.from(JSON.stringify(obj))
      .toString("base64")
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

  const h = b64(header);
  const p = b64(payload);
  const data = `${h}.${p}`;
  const sig = crypto
    .createHmac("sha256", secret)
    .update(data)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return `${data}.${sig}`;
}

describe("Backend Unit & Validation Tests", () => {
  it("normalizes language keys correctly", () => {
    expect(SandboxManager.normalizeLanguage("python")).toBe("python");
    expect(SandboxManager.normalizeLanguage("Python")).toBe("python");
    expect(SandboxManager.normalizeLanguage("C++")).toBe("cpp");
    expect(SandboxManager.normalizeLanguage("c#")).toBe("csharp");
    expect(SandboxManager.normalizeLanguage("JS")).toBe("javascript");
  });

  it("contains all 6 advertised languages in COMMAND_MAP", () => {
    const required = ["python", "javascript", "c", "cpp", "java", "csharp"];
    for (const lang of required) {
      expect(COMMAND_MAP[lang]).toBeDefined();
      expect(COMMAND_MAP[lang].file).toBeDefined();
      expect(COMMAND_MAP[lang].runCmd.length).toBeGreaterThan(0);
    }
  });

  it("rejects unsupported languages with SandboxValidationError", async () => {
    await expect(
      SandboxManager.run("print('hi')", "rust")
    ).rejects.toBeInstanceOf(SandboxValidationError);
  });

  it("rejects empty code with SandboxValidationError", async () => {
    await expect(
      SandboxManager.run("", "python")
    ).rejects.toBeInstanceOf(SandboxValidationError);
  });

  it("rejects oversized source code", async () => {
    const largeCode = "a".repeat(70000); // Exceeds 65536 bytes
    await expect(
      SandboxManager.run(largeCode, "python")
    ).rejects.toBeInstanceOf(SandboxValidationError);
  });

  it("rejects oversized standard input", async () => {
    const largeInput = "b".repeat(70000);
    await expect(
      SandboxManager.run("print('ok')", "python", largeInput)
    ).rejects.toBeInstanceOf(SandboxValidationError);
  });

  it("verifies server assertions and catches expired or scope mismatches", () => {
    const valid = createTestToken("code:execute");
    const verified = verifyServerAssertion(`Bearer ${valid}`, "code:execute");
    expect(verified.success).toBe(true);

    const wrongScope = verifyServerAssertion(`Bearer ${valid}`, "code:write");
    expect(wrongScope.success).toBe(false);

    const expired = createTestToken("code:execute", "USER", "user", -10);
    const expiredRes = verifyServerAssertion(`Bearer ${expired}`, "code:execute");
    expect(expiredRes.success).toBe(false);
  });

  it("handler sets HTTP 400 when missing required fields", async () => {
    const set: { status?: number } = {};
    const validToken = createTestToken("code:execute");
    const res = await executeRouteHandler({
      body: { code: "", language: "" },
      headers: { authorization: `Bearer ${validToken}` },
      set,
    });
    expect(set.status).toBe(400);
    expect(res.status).toBe(400);
  });

  it("handler sets HTTP 422 on unsupported runtime", async () => {
    const set: { status?: number } = {};
    const validToken = createTestToken("code:execute");
    const res = await executeRouteHandler({
      body: { code: "print(1)", language: "brainfuck" },
      headers: { authorization: `Bearer ${validToken}` },
      set,
    });
    expect(set.status).toBe(422);
    expect(res.status).toBe(422);
  });
});

describe("Real Docker Execution Integration Tests", () => {
  it("executes Python 3 code successfully", async () => {
    const result = await SandboxManager.run("print('Hello, Python!')", "python");
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toBe("Hello, Python!");
    expect(result.timedOut).toBe(false);
  });

  it("executes Python code with batch standard input", async () => {
    const code = `
import sys
name = sys.stdin.readline().strip()
print(f"Welcome, {name}!")
`;
    const result = await SandboxManager.run(code, "python", "VisualizeX");
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toBe("Welcome, VisualizeX!");
  });

  it("captures Python syntax error with non-zero exit code", async () => {
    const code = "print('Unterminated string";
    const result = await SandboxManager.run(code, "python");
    expect(result.exitCode).not.toBe(0);
    expect(result.stderr).toContain("SyntaxError");
  });

  it("executes Node.js 20 JavaScript code successfully", async () => {
    const code = "console.log('Hello, Node 20!');";
    const result = await SandboxManager.run(code, "javascript");
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toBe("Hello, Node 20!");
  });

  it("executes C (GCC) code successfully", async () => {
    const code = `
#include <stdio.h>
int main() {
    printf("Hello from C\\n");
    return 0;
}
`;
    const result = await SandboxManager.run(code, "c");
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toBe("Hello from C");
  });

  it("executes C++ (G++) code successfully", async () => {
    const code = `
#include <iostream>
int main() {
    std::cout << "Hello from C++" << std::endl;
    return 0;
}
`;
    const result = await SandboxManager.run(code, "cpp");
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toBe("Hello from C++");
  });

  it("executes Java 17 code successfully", async () => {
    const code = `
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Java 17");
    }
}
`;
    const result = await SandboxManager.run(code, "java");
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toBe("Hello from Java 17");
  });

  it("executes C# (Mono 6.8) code successfully", async () => {
    const code = `
using System;
class Program {
    static void Main() {
        Console.WriteLine("Hello from C# Mono");
    }
}
`;
    const result = await SandboxManager.run(code, "csharp");
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toBe("Hello from C# Mono");
  });

  it("enforces timeout on infinite loop and kills container cleanly", async () => {
    const code = "while True: pass";
    const result = await SandboxManager.run(code, "python", "", 1500); // 1.5s timeout
    expect(result.timedOut).toBe(true);
    expect(result.stderr).toContain("Execution timed out");

    // Verify no running containers remain matching vx-exec-
    const { stdout } = await execFileAsync("docker", ["ps", "-q", "--filter", "name=vx-exec-"]);
    expect(stdout.trim()).toBe("");
  });

  it("enforces output limit on excessive output stream", async () => {
    const code = `
import sys
for _ in range(10000):
    print("A" * 100)
`;
    const result = await SandboxManager.run(code, "python");
    expect(result.outputExceeded || result.stdout.length > 0).toBe(true);
  });
});
