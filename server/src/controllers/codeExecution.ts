import { spawn } from "child_process";
import type { Handler } from "elysia";

const restrictedPatterns = [
  // Common Dangerous Shell Commands
  /rm\s+-rf/, // Delete files/folders recursively
  /sudo/, // Privileged access
  /chmod\s+[0-7]{3,4}/, // Change permissions
  /chown/, // Change ownership
  /dd\s+if=/, // Disk operations
  /mkfs/, // File system creation
  /shutdown/, // Shutdown command
  /reboot/, // Reboot command
  /kill\s+-9/, // Kill processes
  /wget\s+http/, // Downloading external files
  /curl\s+http/, // HTTP requests for remote downloads
  /iptables/, // Modify firewall rules
  /nc\s+-l/, // Netcat listener
  /unzip\s+-o/, // Overwriting files during unzip

  // Python-Specific Dangerous Imports
  /import\s+os/, // OS module
  /import\s+subprocess/, // Subprocess module
  /import\s+sys/, // System module
  /import\s+socket/, // Networking
  /import\s+shutil/, // File operations
  /exec\(.+\)/, // Dynamic code execution
  /eval\(.+\)/, // Evaluate Python expressions dynamically

  // JavaScript Dangerous Code
  /require\(.+child_process.+\)/, // Child process in Node.js
  /process\.env/, // Accessing environment variables
  /process\.exit/, // Exiting Node.js process
  /fs\.(writeFile|appendFile|unlink|rmdir)/, // File operations
  /globalThis/, // Accessing the global object
  /Function\(.+\)/, // Dynamic function execution
  /eval\(.+\)/, // Evaluate JS expressions

  // C and C++ Dangerous Patterns
  /#include\s*<unistd.h>/, // Unix-specific operations
  /system\s*\(.+\)/, // Execute shell commands
  /fork\(\)/, // Process forking
  /exec.*\(.+\)/, // Executing commands
  /setuid\(.+\)/, // Set user ID for processes
  /setgid\(.+\)/, // Set group ID for processes

  // Bash Scripts and Commands
  /:(){:|:&};:/, // Fork bomb
  /&&\s*rm\s+-rf/, // Command chaining with deletion
  />\s*\/dev\/null/, // Redirecting output to null
  /\$\(\s*curl/, // Command substitution with curl
  /\$\(\s*wget/, // Command substitution with wget
  /echo\s+".*">.*\.(sh|bat)/, // Writing scripts to files
  /bash\s+-c\s*".*"/, // Running inline bash commands

  // Java Specific
  /System\.exit/, // Terminate JVM
  /Runtime\.getRuntime\(\)\.exec/, // Runtime execution of commands
  /java\.nio\.file\.Files/, // File operations
  /ProcessBuilder/, // Process creation
  /Thread\.sleep/, // Long delays

  // Generic Dangerous Patterns
  /base64\s+-d/, // Decoding base64
  /curl\s+-s/, // Silent HTTP requests
  /wget\s+-q/, // Quiet HTTP requests
  /\.\.\//, // Directory traversal
  /passwd/, // Accessing password files
  /shadow/, // Accessing shadow files
];


export const executeCode = (code: string, language: string, inputs?: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Check for malicious code
    for (const pattern of restrictedPatterns) {
      if (pattern.test(code)) {
        return reject("Malicious code detected");
      }
    }

    let process;
    let command: string[] = [];
    let output = "";
    let error = "";

    if (language === "python") {
      command = [global.process.platform === "win32" ? "python" : "python3", "-c", code];
      process = spawn(command[0], command.slice(1), { stdio: ["pipe", "pipe", "pipe"] });
    } else if (language === "javascript") {
      command = ["node", "-e", code];
      process = spawn(command[0], command.slice(1), { stdio: ["pipe", "pipe", "pipe"] });
    } else if (language === "bash") {
      command = ["bash", "-c", code];
      process = spawn(command[0], command.slice(1), { stdio: ["pipe", "pipe", "pipe"] });
    } else {
      return reject("Unsupported language");
    }

    // Timeout mechanism
    const timeout = setTimeout(() => {
      process.kill();
      reject("Execution time exceeded the limit of 3 seconds");
    }, 3000); // 3 seconds

    // Collect output and errors
    process.stdout.on("data", (data) => {
      output += data.toString();
    });

    process.stderr.on("data", (data) => {
      error += data.toString();
    });

    process.on("close", (exitCode) => {
      clearTimeout(timeout);
      if (exitCode === 0) {
        resolve(output.trim());
      } else {
        reject(error.trim());
      }
    });

    // Write inputs if any
    if (inputs) {
      process.stdin.write(inputs + "\n");
    }
    process.stdin.end();
  });
};

type MyHandler = Handler<{
  body: {
    code: string;
    language: string;
    inputs?: string;
  };
}>;

export const executeRouteHandler: MyHandler = async ({ body }: { body: { code: string; language: string; inputs?: string; } }) => {
    const { code, language, inputs } = body;
  
  if (!code || !language) {
    return { error: "Code and language are required", status: 400 };
  }

  try {
    const result = await executeCode(code, language, inputs);
    return { result, status: 200 };
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error), status: 500 };
  }
};
