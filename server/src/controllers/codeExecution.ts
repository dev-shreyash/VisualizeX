import { spawn, spawnSync } from "child_process";
import type { Handler } from "elysia";
import { writeFileSync, rmSync, mkdtempSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

const restrictedPatterns = [
  /rm\s+-rf/, /sudo/, /chmod\s+[0-7]{3,4}/, /chown/, /dd\s+if=/, /mkfs/,
  /shutdown/, /reboot/, /kill\s+-9/, /wget\s+http/, /curl\s+http/, /iptables/,
  /nc\s+-l/, /unzip\s+-o/, /import\s+os/, /import\s+subprocess/, /import\s+sys/,
  /import\s+socket/, /import\s+shutil/, /exec\(.+\)/, /eval\(.+\)/, /require\(.+child_process.+\)/,
  /process\.env/, /process\.exit/, /fs\.(writeFile|appendFile|unlink|rmdir)/,
  /globalThis/, /Function\(.+\)/, /eval\(.+\)/, /#include\s*<unistd.h>/, /system\s*\(.+\)/,
  /fork\(\)/, /exec.*\(.+\)/, /setuid\(.+\)/, /setgid\(.+\)/, /:(){:|:&};:/,
  /&&\s*rm\s+-rf/, />\s*\/dev\/null/, /\$\(\s*curl/, /\$\(\s*wget/,
  /echo\s+".*">.*\.(sh|bat)/, /bash\s+-c\s*".*"/, /System\.exit/,
  /Runtime\.getRuntime\(\)\.exec/, /java\.nio\.file\.Files/,
  /ProcessBuilder/, /Thread\.sleep/, /base64\s+-d/, /curl\s+-s/,
  /wget\s+-q/, /\.\.\//, /passwd/, /shadow/
];

/**
 * Checks if a given command is available on the system.
 * Uses "which" on Linux/Mac and "where" on Windows.
 */
const checkCommandAvailability = (cmd: string): boolean => {
  const whichCommand = process.platform === "win32" ? "where" : "which";
  const result = spawnSync(whichCommand, [cmd], { encoding: "utf8" });
  return result.status === 0;
};

/**
 * Checks and automatically installs missing dependencies for interpreted languages
 * and scans for import/include/using statements for compiled languages.
 */
const ensureDependencies = async (code: string, language: string): Promise<void> => {
  if (language === "python") {
    // Extract library names from "import" and "from" statements.
    const importMatches = [...code.matchAll(/^import\s+([\w\d_]+)/gm)];
    const fromMatches = [...code.matchAll(/^from\s+([\w\d_]+)\s+import/gm)];
    const libraries = Array.from(new Set([
      ...importMatches.map((m) => m[1]),
      ...fromMatches.map((m) => m[1])
    ]));

    for (const lib of libraries) {
      const isInstalled = await new Promise<boolean>((resolve) => {
        const checkCmd = spawn("python3", ["-c", `import ${lib}`]);
        checkCmd.on("close", (code) => resolve(code === 0));
      });
      if (!isInstalled) {
        console.log(`Installing missing Python package: ${lib}`);
        await new Promise<void>((resolve, reject) => {
          const installCmd = spawn("pip3", ["install", lib], { stdio: "inherit" });
          installCmd.on("close", (code) => {
            code === 0 ? resolve() : reject(`Failed to install ${lib}`);
          });
        });
      }
    }
  } else if (language === "javascript") {
    const requireMatches = [...code.matchAll(/require\(['"`]([\w\d-_]+)['"`]\)/gm)];
    const importMatches = [...code.matchAll(/import\s+[\w{}*]+\s+from\s+['"`]([\w\d-_]+)['"`]/gm)];
    const libraries = Array.from(new Set([
      ...requireMatches.map((m) => m[1]),
      ...importMatches.map((m) => m[1])
    ]));

    for (const lib of libraries) {
      const isInstalled = await new Promise<boolean>((resolve) => {
        const checkCmd = spawn("npm", ["list", lib]);
        checkCmd.on("close", (code) => resolve(code === 0));
      });
      if (!isInstalled) {
        console.log(`Installing missing JavaScript package: ${lib}`);
        await new Promise<void>((resolve, reject) => {
          const installCmd = spawn("npm", ["install", lib], { stdio: "inherit" });
          installCmd.on("close", (code) => {
            code === 0 ? resolve() : reject(`Failed to install ${lib}`);
          });
        });
      }
    }
  }
  // For compiled languages, we simply scan and warn.
  else if (language === "java") {
    const importMatches = [...code.matchAll(/^import\s+([\w.]+);/gm)];
    const libraries = Array.from(new Set(importMatches.map(m => m[1])));
    libraries.forEach(lib => {
      if (!lib.startsWith("java.") && !lib.startsWith("javax.")) {
        console.warn(`Warning: Detected non-standard Java dependency: ${lib}. Automatic installation is not supported.`);
      }
    });
  } else if (language === "c") {
    const includeMatches = [...code.matchAll(/^#include\s+<([^>]+)>/gm)];
    const libraries = Array.from(new Set(includeMatches.map(m => m[1])));
    const standardHeaders = ["stdio.h", "stdlib.h", "string.h", "math.h", "stdbool.h", "limits.h", "ctype.h", "errno.h"];
    libraries.forEach(lib => {
      if (!standardHeaders.includes(lib)) {
        console.warn(`Warning: Detected non-standard C dependency: ${lib}. Automatic installation is not supported.`);
      }
    });
  } else if (language === "c++") {
    const includeMatches = [...code.matchAll(/^#include\s+<([^>]+)>/gm)];
    const libraries = Array.from(new Set(includeMatches.map(m => m[1])));
    const standardHeaders = ["iostream", "vector", "string", "map", "set", "algorithm", "cmath", "cstdlib", "cstdio", "cstring"];
    libraries.forEach(lib => {
      if (!standardHeaders.includes(lib)) {
        console.warn(`Warning: Detected non-standard C++ dependency: ${lib}. Automatic installation is not supported.`);
      }
    });
  } else if (language === "c#") {
    const usingMatches = [...code.matchAll(/^using\s+([\w.]+);/gm)];
    const libraries = Array.from(new Set(usingMatches.map(m => m[1])));
    libraries.forEach(lib => {
      if (!lib.startsWith("System")) {
        console.warn(`Warning: Detected non-standard C# dependency: ${lib}. Automatic installation is not supported.`);
      }
    });
  }
};

// Helper: Check if the current process is elevated on Windows.
const isElevatedWindows = (): boolean => {
  if (process.platform !== "win32") return true; // not Windows, so ignore.
  try {
    // "net session" requires admin rights. If it fails, we are not elevated.
    const result = spawnSync("net", ["session"], { stdio: "ignore" });
    return result.status === 0;
  } catch (err) {
    return false;
  }
};

/**
 * Attempts to check for and install the required compiler if it is not installed.
 * On Windows, if not running in an elevated shell, it throws an error instructing the user.
 */
const checkAndInstallCompiler = async (language: string): Promise<void> => {
  let compiler = "";
  let installCommand: string[] = [];
  
  switch (language) {
    case "java":
      compiler = "javac";
      if (!checkCommandAvailability(compiler)) {
        console.warn(`Compiler ${compiler} not found.`);
        if (process.platform === "linux") {
          installCommand = ["sudo", "apt-get", "update"];
          spawnSync(installCommand[0], installCommand.slice(1), { stdio: "inherit" });
          installCommand = ["sudo", "apt-get", "install", "-y", "default-jdk"];
        } else if (process.platform === "win32") {
          if (!isElevatedWindows()) {
            throw new Error("Automatic installation of Java (via Chocolatey) requires an elevated shell. Please run the server as Administrator or install Java manually.");
          }
          installCommand = ["choco", "install", "jdk8", "-y"];
        } else {
          throw new Error(`Compiler ${compiler} is not installed and automatic installation is not supported on this platform.`);
        }
      }
      break;
    case "c":
      compiler = "gcc";
      if (!checkCommandAvailability(compiler)) {
        console.warn(`Compiler ${compiler} not found.`);
        if (process.platform === "linux") {
          installCommand = ["sudo", "apt-get", "update"];
          spawnSync(installCommand[0], installCommand.slice(1), { stdio: "inherit" });
          installCommand = ["sudo", "apt-get", "install", "-y", "build-essential"];
        } else if (process.platform === "win32") {
          if (!isElevatedWindows()) {
            throw new Error("Automatic installation of GCC (via Chocolatey) requires an elevated shell. Please run the server as Administrator or install GCC manually.");
          }
          installCommand = ["choco", "install", "mingw", "-y"];
        } else {
          throw new Error(`Compiler ${compiler} is not installed and automatic installation is not supported on this platform.`);
        }
      }
      break;
    case "c++":
      compiler = "g++";
      if (!checkCommandAvailability(compiler)) {
        console.warn(`Compiler ${compiler} not found.`);
        if (process.platform === "linux") {
          installCommand = ["sudo", "apt-get", "update"];
          spawnSync(installCommand[0], installCommand.slice(1), { stdio: "inherit" });
          installCommand = ["sudo", "apt-get", "install", "-y", "build-essential"];
        } else if (process.platform === "win32") {
          if (!isElevatedWindows()) {
            throw new Error("Automatic installation of G++ (via Chocolatey) requires an elevated shell. Please run the server as Administrator or install G++ manually.");
          }
          installCommand = ["choco", "install", "mingw", "-y"];
        } else {
          throw new Error(`Compiler ${compiler} is not installed and automatic installation is not supported on this platform.`);
        }
      }
      break;
    case "c#":
      compiler = "mcs";
      if (!checkCommandAvailability(compiler)) {
        console.warn(`Compiler ${compiler} not found.`);
        if (process.platform === "linux") {
          installCommand = ["sudo", "apt-get", "update"];
          spawnSync(installCommand[0], installCommand.slice(1), { stdio: "inherit" });
          installCommand = ["sudo", "apt-get", "install", "-y", "mono-mcs"];
        } else if (process.platform === "win32") {
          if (!isElevatedWindows()) {
            throw new Error("Automatic installation of Mono (via Chocolatey) requires an elevated shell. Please run the server as Administrator or install Mono manually.");
          }
          installCommand = ["choco", "install", "mono", "-y"];
        } else {
          throw new Error(`Compiler ${compiler} is not installed and automatic installation is not supported on this platform.`);
        }
      }
      break;
  }

  if (installCommand.length > 0) {
    console.log(`Attempting to install ${compiler} using: ${installCommand.join(" ")}`);
    const installProc = spawnSync(installCommand[0], installCommand.slice(1), { stdio: "inherit" });
    if (installProc.status !== 0) {
      throw new Error(`Failed to install ${compiler}`);
    }
    if (!checkCommandAvailability(compiler)) {
      throw new Error(`${compiler} still not found after installation attempt.`);
    }
    console.log(`${compiler} installation successful.`);
  }
};
/*
 * Executes compiled code by writing the source to a temporary file,
 * compiling it, and then running the resulting executable.
 */
const executeCompiledCode = (
  sourceCode: string,
  sourceFileName: string,
  compileCmd: string[],
  execCmd: string[],
  inputs?: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const tempDir = mkdtempSync(join(tmpdir(), "exec-"));
    const sourceFilePath = join(tempDir, sourceFileName);
    writeFileSync(sourceFilePath, sourceCode);

    const compileProcess = spawn(compileCmd[0], compileCmd.slice(1), { cwd: tempDir, stdio: "pipe" });
    let compileError = "";
    compileProcess.stderr.on("data", (data) => {
      compileError += data.toString();
    });
    compileProcess.on("close", (compileCode) => {
      if (compileCode !== 0) {
        rmSync(tempDir, { recursive: true, force: true });
        return reject("Compilation error: " + compileError);
      }
      let executable = execCmd[0];
      if (executable.startsWith("./")) {
        executable = join(tempDir, executable.slice(2));
      }
      const runProcess = spawn(executable, execCmd.slice(1), { cwd: tempDir, stdio: ["pipe", "pipe", "pipe"] });
      let output = "";
      let runError = "";
      const timeout = setTimeout(() => {
        runProcess.kill();
      }, 3000);
      runProcess.stdout.on("data", (data) => { output += data.toString(); });
      runProcess.stderr.on("data", (data) => { runError += data.toString(); });
      runProcess.on("close", (exitCode) => {
        clearTimeout(timeout);
        rmSync(tempDir, { recursive: true, force: true });
        exitCode === 0 ? resolve(output.trim()) : reject(runError.trim());
      });
      if (inputs) { runProcess.stdin.write(inputs + "\n"); }
      runProcess.stdin.end();
    });
  });
};

/**
 * Executes the given code after ensuring dependencies and compilers are installed.
 * Supports Python, JavaScript, Bash, Java, C, C++, and C#.
 */
export const executeCode = async (code: string, language: string, inputs?: string): Promise<string> => {
  // Check for malicious code patterns.
  for (const pattern of restrictedPatterns) {
    if (pattern.test(code)) {
      throw new Error("Malicious code detected");
    }
  }

  // For interpreted languages, install dependencies if needed.
  await ensureDependencies(code, language);

  // Normalize language input.
  const lang = language.toLowerCase().trim();

  // For compiled languages, check and install the compiler if needed.
  if (["java", "c", "c++", "cpp", "c#", "csharp"].includes(lang)) {
    let canonicalLang = lang;
    if (lang === "cpp") canonicalLang = "c++";
    if (lang === "csharp") canonicalLang = "c#";
    await checkAndInstallCompiler(canonicalLang);
  }

  if (lang === "python") {
    const command = [process.platform === "win32" ? "python" : "python3", "-c", code];
    return new Promise<string>((resolve, reject) => {
      const proc = spawn(command[0], command.slice(1), { stdio: ["pipe", "pipe", "pipe"] });
      let output = "";
      let error = "";
      const timeout = setTimeout(() => {
        proc.kill();
        console.error("Execution time exceeded the limit of 3 seconds");
      }, 3000);
      proc.stdout.on("data", (data) => { output += data.toString(); });
      proc.stderr.on("data", (data) => { error += data.toString(); });
      proc.on("close", (exitCode) => {
        clearTimeout(timeout);
        exitCode === 0 ? resolve(output.trim()) : reject(error.trim());
      });
      if (inputs) proc.stdin.write(inputs + "\n");
      proc.stdin.end();
    });
  } else if (lang === "javascript") {
    const command = ["node", "-e", code];
    return new Promise<string>((resolve, reject) => {
      const proc = spawn(command[0], command.slice(1), { stdio: ["pipe", "pipe", "pipe"] });
      let output = "";
      let error = "";
      const timeout = setTimeout(() => {
        proc.kill();
        console.error("Execution time exceeded the limit of 3 seconds");
      }, 3000);
      proc.stdout.on("data", (data) => { output += data.toString(); });
      proc.stderr.on("data", (data) => { error += data.toString(); });
      proc.on("close", (exitCode) => {
        clearTimeout(timeout);
        exitCode === 0 ? resolve(output.trim()) : reject(error.trim());
      });
      if (inputs) proc.stdin.write(inputs + "\n");
      proc.stdin.end();
    });
  } else if (lang === "bash") {
    const command = ["bash", "-c", code];
    return new Promise<string>((resolve, reject) => {
      const proc = spawn(command[0], command.slice(1), { stdio: ["pipe", "pipe", "pipe"] });
      let output = "";
      let error = "";
      const timeout = setTimeout(() => {
        proc.kill();
        console.error("Execution time exceeded the limit of 3 seconds");
      }, 3000);
      proc.stdout.on("data", (data) => { output += data.toString(); });
      proc.stderr.on("data", (data) => { error += data.toString(); });
      proc.on("close", (exitCode) => {
        clearTimeout(timeout);
        exitCode === 0 ? resolve(output.trim()) : reject(error.trim());
      });
      if (inputs) proc.stdin.write(inputs + "\n");
      proc.stdin.end();
    });
  }
  else if (lang === "java") {
    return await executeCompiledCode(code, "Main.java", ["javac", "Main.java"], ["java", "Main"], inputs);
  } else if (lang === "c") {
    return await executeCompiledCode(code, "main.c", ["gcc", "main.c", "-o", "main"], ["./main"], inputs);
  } else if (lang === "c++" || lang === "cpp") {
    return await executeCompiledCode(code, "main.cpp", ["g++", "main.cpp", "-o", "main"], ["./main"], inputs);
  } else if (lang === "c#" || lang === "csharp") {
    return await executeCompiledCode(code, "Program.cs", ["mcs", "Program.cs"], ["mono", "Program.exe"], inputs);
  } else {
    throw new Error("Unsupported language");
  }
};

type MyHandler = Handler<{
  body: {
    code: string;
    language: string;
    inputs?: string;
  };
}>;

export const executeRouteHandler: MyHandler = async ({ body }: { body: { code: string; language: string; inputs?: string } }) => {
  const { code, language, inputs } = body;
  if (!code || !language) {
    return { error: "Code and language are required", status: 400 };
  }
  try {
    const result = await executeCode(code, language, inputs);
    return { result, status: 200 };
  } catch (err) {
    return { error: err instanceof Error ? err.message : String(err), status: 500 };
  }
};
