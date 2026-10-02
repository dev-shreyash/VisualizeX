import { spawn } from "child_process";
import { mkdtemp, writeFile, rm, chmod } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";


export interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  timedOut: boolean;
  wallTimeMs: number;
}

const COMMAND_MAP: Record<string, { file: string; runCmd: string[] }> = {
  python: { file: "main.py", runCmd: ["python3", "/sandbox/main.py"] },
  javascript: { file: "main.js", runCmd: ["node", "/sandbox/main.js"] },
  c: { file: "main.c", runCmd: ["sh", "-c", "gcc -O2 /sandbox/main.c -o /sandbox/main && /sandbox/main"] },
  cpp: { file: "main.cpp", runCmd: ["sh", "-c", "g++ -O2 /sandbox/main.cpp -o /sandbox/main && /sandbox/main"] },
  java: { file: "Main.java", runCmd: ["sh", "-c", "javac /sandbox/Main.java && java -cp /sandbox Main"] },
  csharp: { file: "Program.cs", runCmd: ["sh", "-c", "mcs /sandbox/Program.cs -out:/sandbox/app.exe && mono /sandbox/app.exe"] },
};

export class SandboxManager {
  private static activeRuns = 0;
  private static readonly MAX_CONCURRENT = 5;

  public static async run(code: string, language: string, inputs = "", timeoutMs = 3000): Promise<ExecutionResult> {
    const lang = language.toLowerCase() === "c++" ? "cpp" : language.toLowerCase();
    const config = COMMAND_MAP[lang];
    if (!config) throw new Error(`Unsupported runtime: ${language}`);

    if (this.activeRuns >= this.MAX_CONCURRENT) {
      throw new Error("Server capacity full. Please retry in a few seconds.");
    }

    this.activeRuns++;
    const tempDir = await mkdtemp(join(tmpdir(), "vx-sandbox-"));
    await chmod(tempDir, 0o777);
    const filePath = join(tempDir, config.file);
    await writeFile(filePath, code, "utf8");
    await chmod(filePath, 0o666);

    const startTime = performance.now();
    const dockerArgs = [
      "run",
      "--rm",
      "-i",
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
      "visualizex-runner:latest",
      ...config.runCmd,
    ];

    return new Promise<ExecutionResult>((resolve) => {
      let stdout = "";
      let stderr = "";
      let timedOut = false;

      const proc = spawn("docker", dockerArgs, { stdio: ["pipe", "pipe", "pipe"] });

      const timer = setTimeout(() => {
        timedOut = true;
        proc.kill("SIGKILL");
      }, timeoutMs);

      if (inputs) proc.stdin.write(inputs + "\n");
      proc.stdin.end();

      proc.stdout.on("data", (d) => { if (stdout.length < 32768) stdout += d.toString(); });
      proc.stderr.on("data", (d) => { if (stderr.length < 32768) stderr += d.toString(); });

      proc.on("close", async (exitCode) => {
        clearTimeout(timer);
        this.activeRuns--;
        await rm(tempDir, { recursive: true, force: true }).catch(() => {});

        resolve({
          stdout: stdout.trim(),
          stderr: timedOut ? "Execution timed out (Limit: 3s)" : stderr.trim(),
          exitCode,
          timedOut,
          wallTimeMs: Math.round(performance.now() - startTime),
        });
      });
    });
  }
}