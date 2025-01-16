// Change from bun:test to Jest's built-in test functions
import { executeCode } from "../src/controllers/codeExecution";

describe("executeCode function", () => {
  it("should execute Python code successfully", async () => {
    const code = "print('Hello, Python!')";
    const language = "python";
    const result = await executeCode(code, language);
    expect(result).toBe("Hello, Python!");
  });

  it("should execute JavaScript code successfully", async () => {
    const code = "console.log('Hello, JavaScript!')";
    const language = "javascript";
    const result = await executeCode(code, language);
    expect(result).toBe("Hello, JavaScript!");
  });

  it("should handle Python syntax errors", async () => {
    const code = "print('Hello'";
    const language = "python";
    await expect(executeCode(code, language)).rejects.toContain("SyntaxError");
  });

  it("should handle JavaScript syntax errors", async () => {
    const code = "console.log('Hello'";
    const language = "javascript";
    await expect(executeCode(code, language)).rejects.toContain("SyntaxError");
  });

  it("should reject unsupported languages", async () => {
    const code = "print('Hello, World!')";
    const language = "unsupported";
    await expect(executeCode(code, language)).rejects.toBe("Unsupported language");
  });

  it("should detect malicious Python code", async () => {
    const code = "import os; os.system('rm -rf /')";
    const language = "python";
    await expect(executeCode(code, language)).rejects.toBe("Malicious code detected");
  });

  it("should detect malicious JavaScript code", async () => {
    const code = "require('child_process').exec('rm -rf /')";
    const language = "javascript";
    await expect(executeCode(code, language)).rejects.toBe("Malicious code detected");
  });

  it("should timeout on long-running code", async () => {
    const code = "while True: pass";
    const language = "python";
    await expect(executeCode(code, language)).rejects.toBe("Execution time exceeded the limit of 3 seconds");
  });
});
