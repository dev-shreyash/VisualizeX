import { spawn, execFile } from "child_process";
import { mkdtemp, writeFile, rm, mkdir, chmod } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  timedOut: boolean;
  outputExceeded?: boolean;
  wallTimeMs: number;
}

export interface LanguageConfig {
  file: string;
  runCmd: string[];
  displayName: string;
}

export const COMMAND_MAP: Record<string, LanguageConfig> = {
  python: {
    file: "main.py",
    runCmd: ["python3", "/sandbox/main.py"],
    displayName: "Python 3",
  },
  javascript: {
    file: "main.js",
    runCmd: ["node", "/sandbox/main.js"],
    displayName: "JavaScript (Node 20)",
  },
  c: {
    file: "main.c",
    runCmd: ["sh", "-c", "gcc -O2 /sandbox/main.c -o /sandbox/main && /sandbox/main"],
    displayName: "C (GCC)",
  },
  cpp: {
    file: "main.cpp",
    runCmd: ["sh", "-c", "g++ -O2 /sandbox/main.cpp -o /sandbox/main && /sandbox/main"],
    displayName: "C++ (G++)",
  },
  java: {
    file: "Main.java",
    runCmd: ["sh", "-c", "javac /sandbox/Main.java && java -cp /sandbox Main"],
    displayName: "Java 17",
  },
  csharp: {
    file: "Program.cs",
    runCmd: ["sh", "-c", "mcs /sandbox/Program.cs -out:/sandbox/app.exe && mono /sandbox/app.exe"],
    displayName: "C# (Mono 6.8 / C# 6)",
  },
};

export class SandboxCapacityError extends Error {
  constructor(message = "Server capacity full. Please retry in a few seconds.") {
    super(message);
    this.name = "SandboxCapacityError";
  }
}

export class SandboxValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SandboxValidationError";
  }
}

export class SandboxManager {
  private static activeRuns = 0;
  public static getActiveRuns(): number {
    return this.activeRuns;
  }

  public static getMaxConcurrent(): number {
    const envVal = parseInt(process.env.MAX_CONCURRENT || "5", 10);
    return isNaN(envVal) || envVal <= 0 ? 5 : envVal;
  }

  public static getDefaultTimeoutMs(): number {
    const envVal = parseInt(process.env.EXECUTION_TIMEOUT_MS || "3000", 10);
    return isNaN(envVal) || envVal <= 0 ? 3000 : Math.min(envVal, 10000);
  }

  public static getMaxSourceBytes(): number {
    const envVal = parseInt(process.env.MAX_SOURCE_BYTES || "65536", 10);
    return isNaN(envVal) ? 65536 : envVal;
  }

  public static getMaxInputBytes(): number {
    const envVal = parseInt(process.env.MAX_INPUT_BYTES || "65536", 10);
    return isNaN(envVal) ? 65536 : envVal;
  }

  public static getMaxOutputBytes(): number {
    const envVal = parseInt(process.env.MAX_OUTPUT_BYTES || "65536", 10);
    return isNaN(envVal) ? 65536 : envVal;
  }

  public static normalizeLanguage(rawLang: string): string {
    const trimmed = (rawLang || "").trim().toLowerCase();
    if (trimmed === "c++") return "cpp";
    if (trimmed === "c#") return "csharp";
    if (trimmed === "js") return "javascript";
    if (trimmed === "py") return "python";
    return trimmed;
  }

  public static async run(
    code: string,
    language: string,
    inputs = "",
    requestedTimeoutMs?: number
  ): Promise<ExecutionResult> {
    const lang = this.normalizeLanguage(language);
    const config = COMMAND_MAP[lang];
    if (!config) {
      throw new SandboxValidationError(`Unsupported runtime: ${language}`);
    }

    if (typeof code !== "string" || code.trim().length === 0) {
      throw new SandboxValidationError("Source code is required");
    }

    const codeBytes = Buffer.byteLength(code, "utf8");
    if (codeBytes > this.getMaxSourceBytes()) {
      throw new SandboxValidationError(`Source code exceeds maximum size of ${this.getMaxSourceBytes()} bytes`);
    }

    const inputBytes = Buffer.byteLength(inputs, "utf8");
    if (inputBytes > this.getMaxInputBytes()) {
      throw new SandboxValidationError(`Input exceeds maximum size of ${this.getMaxInputBytes()} bytes`);
    }

    // Enforce concurrency limit
    if (this.activeRuns >= this.getMaxConcurrent()) {
      throw new SandboxCapacityError();
    }

    this.activeRuns++;
    const runId = randomUUID();
    const containerName = `vx-exec-${runId}`;
    const hostWorkspaceBase = process.env.HOST_WORKSPACE_PATH || "/tmp/visualizex-workspaces";
    let tempDir: string | null = null;

    const timeoutMs = Math.min(
      requestedTimeoutMs && requestedTimeoutMs > 0 ? requestedTimeoutMs : this.getDefaultTimeoutMs(),
      10000
    );

    try {
      await mkdir(hostWorkspaceBase, { recursive: true, mode: 0o777 });
      tempDir = await mkdtemp(join(hostWorkspaceBase, "run-"));
      await chmod(tempDir, 0o777);

      const filePath = join(tempDir, config.file);
      await writeFile(filePath, code, { encoding: "utf8", mode: 0o666 });
      await chmod(filePath, 0o666);

      const runnerImage = process.env.RUNNER_IMAGE || "visualizex-runner:latest";
      const dockerArgs = [
        "run",
        "-i",
        `--name=${containerName}`,
        "--network", "none",
        "--memory=128m",
        "--memory-swap=128m",
        "--cpus=0.5",
        "--pids-limit=64",
        "--read-only",
        "--tmpfs", "/tmp:rw,noexec,nosuid,size=16m",
        "--security-opt=no-new-privileges:true",
        "--cap-drop=ALL",
        "--user", "1001:1001",
        "-v", `${tempDir}:/sandbox:rw`,
        runnerImage,
        ...config.runCmd,
      ];

      const startTime = performance.now();
      const maxOutputBytes = this.getMaxOutputBytes();

      return await new Promise<ExecutionResult>((resolve) => {
        let stdoutChunks: Buffer[] = [];
        let stderrChunks: Buffer[] = [];
        let totalStdoutBytes = 0;
        let totalStderrBytes = 0;
        let timedOut = false;
        let outputExceeded = false;
        let closed = false;

        const killContainer = async () => {
          try {
            await execFileAsync("docker", ["kill", containerName]);
          } catch {
            // Ignored if already exited
          }
        };

        const proc = spawn("docker", dockerArgs, { stdio: ["pipe", "pipe", "pipe"] });

        const timer = setTimeout(async () => {
          timedOut = true;
          await killContainer();
          try {
            proc.kill("SIGKILL");
          } catch {}
        }, timeoutMs);

        if (inputs) {
          proc.stdin.write(inputs + "\n");
        }
        proc.stdin.end();

        proc.stdout.on("data", async (chunk: Buffer) => {
          if (outputExceeded) return;
          totalStdoutBytes += chunk.length;
          if (totalStdoutBytes > maxOutputBytes) {
            outputExceeded = true;
            clearTimeout(timer);
            await killContainer();
            try { proc.kill("SIGKILL"); } catch {}
          } else {
            stdoutChunks.push(chunk);
          }
        });

        proc.stderr.on("data", async (chunk: Buffer) => {
          if (outputExceeded) return;
          totalStderrBytes += chunk.length;
          if (totalStderrBytes > maxOutputBytes) {
            outputExceeded = true;
            clearTimeout(timer);
            await killContainer();
            try { proc.kill("SIGKILL"); } catch {}
          } else {
            stderrChunks.push(chunk);
          }
        });

        proc.on("error", async (err) => {
          if (closed) return;
          closed = true;
          clearTimeout(timer);
          await killContainer();

          resolve({
            stdout: Buffer.concat(stdoutChunks as any).toString("utf8").trim(),
            stderr: `Sandbox execution process error: ${err.message}`,
            exitCode: 1,
            timedOut: false,
            outputExceeded: false,
            wallTimeMs: Math.round(performance.now() - startTime),
          });
        });

        proc.on("close", (exitCode) => {
          if (closed) return;
          closed = true;
          clearTimeout(timer);

          const stdout = Buffer.concat(stdoutChunks as any).toString("utf8").trim();
          let stderr = Buffer.concat(stderrChunks as any).toString("utf8").trim();

          if (timedOut) {
            stderr = `Execution timed out (Limit: ${Math.round(timeoutMs / 1000)}s)`;
          } else if (outputExceeded) {
            stderr = `Output exceeded maximum allowed limit of ${maxOutputBytes} bytes`;
          }

          resolve({
            stdout,
            stderr,
            exitCode,
            timedOut,
            outputExceeded,
            wallTimeMs: Math.round(performance.now() - startTime),
          });
        });
      });
    } finally {
      // Guaranteed resource cleanup
      this.activeRuns--;

      // Clean up container
      try {
        await execFileAsync("docker", ["rm", "-f", containerName]);
      } catch {
        // Container might have already been removed
      }

      // Clean up workspace directory
      if (tempDir) {
        await rm(tempDir, { recursive: true, force: true }).catch(() => {});
      }
    }
  }
}
