import { spawn } from "child_process";
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
 * Checks and automatically installs missing dependencies for Python and JavaScript.
 * For Java, C, C++, and C#, it scans for import/include/using statements and logs warnings
 * if non‑standard dependencies are detected (auto‑installation is not supported for these languages).
 */
const ensureDependencies = async (code: string, language: string) => {
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
    // Extract libraries using require and ES6 import syntax.
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
  // For Java, check for non-standard imports.
  else if (language === "java") {
    const importMatches = [...code.matchAll(/^import\s+([\w.]+);/gm)];
    const libraries = Array.from(new Set(importMatches.map(m => m[1])));
    libraries.forEach(lib => {
      // Standard libraries start with java. or javax.
      if (!lib.startsWith("java.") && !lib.startsWith("javax.")) {
        console.warn(`Warning: Detected non-standard Java dependency: ${lib}. Automatic installation is not supported.`);
      }
    });
  }
  // For C, check for non-standard includes.
  else if (language === "c") {
    const includeMatches = [...code.matchAll(/^#include\s+<([^>]+)>/gm)];
    const libraries = Array.from(new Set(includeMatches.map(m => m[1])));
    const standardHeaders = ["stdio.h", "stdlib.h", "string.h", "math.h", "stdbool.h", "limits.h", "ctype.h", "errno.h"];
    libraries.forEach(lib => {
      if (!standardHeaders.includes(lib)) {
        console.warn(`Warning: Detected non-standard C dependency: ${lib}. Automatic installation is not supported.`);
      }
    });
  }
  // For C++, check for non-standard includes.
  else if (language === "c++") {
    const includeMatches = [...code.matchAll(/^#include\s+<([^>]+)>/gm)];
    const libraries = Array.from(new Set(includeMatches.map(m => m[1])));
    const standardHeaders = ["iostream", "vector", "string", "map", "set", "algorithm", "cmath", "cstdlib", "cstdio", "cstring"];
    libraries.forEach(lib => {
      if (!standardHeaders.includes(lib)) {
        console.warn(`Warning: Detected non-standard C++ dependency: ${lib}. Automatic installation is not supported.`);
      }
    });
  }
  // For C#, check for non-standard using statements.
  else if (language === "c#") {
    const usingMatches = [...code.matchAll(/^using\s+([\w.]+);/gm)];
    const libraries = Array.from(new Set(usingMatches.map(m => m[1])));
    libraries.forEach(lib => {
      // Assume that standard libraries start with System.
      if (!lib.startsWith("System")) {
        console.warn(`Warning: Detected non-standard C# dependency: ${lib}. Automatic installation is not supported.`);
      }
    });
  }
};

/**
 * Executes compiled code by writing the source to a temporary file,
 * compiling it, and then running the resulting executable.
 *
 * @param sourceCode - The source code to compile.
 * @param sourceFileName - The file name to use (e.g. "Main.java", "main.c").
 * @param compileCmd - Array representing the compile command and its arguments.
 * @param execCmd - Array representing the run command and its arguments.
 * @param inputs - (Optional) Input to pass to the executable.
 */
const executeCompiledCode = (
  sourceCode: string,
  sourceFileName: string,
  compileCmd: string[],
  execCmd: string[],
  inputs?: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Create a temporary directory.
    const tempDir = mkdtempSync(join(tmpdir(), "exec-"));
    const sourceFilePath = join(tempDir, sourceFileName);
    // Write the source code to file.
    writeFileSync(sourceFilePath, sourceCode);

    // Compile the source code.
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
      // Compilation succeeded; now run the executable.
      const runProcess = spawn(execCmd[0], execCmd.slice(1), { cwd: tempDir, stdio: ["pipe", "pipe", "pipe"] });
      let output = "";
      let runError = "";
      const timeout = setTimeout(() => {
        runProcess.kill();
      }, 3000);
      runProcess.stdout.on("data", (data) => {
        output += data.toString();
      });
      runProcess.stderr.on("data", (data) => {
        runError += data.toString();
      });
      runProcess.on("close", (exitCode) => {
        clearTimeout(timeout);
        rmSync(tempDir, { recursive: true, force: true });
        if (exitCode === 0) {
          resolve(output.trim());
        } else {
          reject(runError.trim());
        }
      });
      if (inputs) {
        runProcess.stdin.write(inputs + "\n");
      }
      runProcess.stdin.end();
    });
  });
};

/**
 * Executes the given code after ensuring dependencies are installed.
 * Supports Python, JavaScript, Bash, Java, C, C++, and C#.
 */
export const executeCode = async (code: string, language: string, inputs?: string): Promise<string> => {
  // Check for malicious code patterns first.
  for (const pattern of restrictedPatterns) {
    if (pattern.test(code)) {
      throw new Error("Malicious code detected");
    }
  }

  // Automatically install dependencies (or warn) as needed.
  await ensureDependencies(code, language);

  // Normalize language input to handle case and common aliases.
  const lang = language.toLowerCase().trim();

  // Interpreted languages.
  if (lang === "python") {
    const command = [global.process.platform === "win32" ? "python" : "python3", "-c", code];
    return new Promise<string>((resolve, reject) => {
      const proc = spawn(command[0], command.slice(1), { stdio: ["pipe", "pipe", "pipe"] });
      let output = "";
      let error = "";
      const timeout = setTimeout(() => {
        proc.kill();
        console.error("Execution time exceeded the limit of 3 seconds");
      }, 3000);
      proc.stdout.on("data", (data) => output += data.toString());
      proc.stderr.on("data", (data) => error += data.toString());
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
      proc.stdout.on("data", (data) => output += data.toString());
      proc.stderr.on("data", (data) => error += data.toString());
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
      proc.stdout.on("data", (data) => output += data.toString());
      proc.stderr.on("data", (data) => error += data.toString());
      proc.on("close", (exitCode) => {
        clearTimeout(timeout);
        exitCode === 0 ? resolve(output.trim()) : reject(error.trim());
      });
      if (inputs) proc.stdin.write(inputs + "\n");
      proc.stdin.end();
    });
  }
  // Compiled languages.
  else if (lang === "java") {
    // Assumes the Java code contains a public class named "Main" with a main method.
    return await executeCompiledCode(code, "Main.java", ["javac", "Main.java"], ["java", "Main"], inputs);
  } else if (lang === "c") {
    return await executeCompiledCode(code, "main.c", ["gcc", "main.c", "-o", "main"], ["./main"], inputs);
  } else if (lang === "c++" || lang === "cpp") {
    return await executeCompiledCode(code, "main.cpp", ["g++", "main.cpp", "-o", "main"], ["./main"], inputs);
  } else if (lang === "c#" || lang === "csharp") {
    // Assumes usage of the Mono C# compiler (mcs) and runtime (mono).
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

/**
 * HTTP route handler that executes code and returns the output.
 */
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
