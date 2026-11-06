import { Elysia } from "elysia";
import { executeRouteHandler } from "./controllers/codeExecution";
import cors from "@elysiajs/cors";
import "dotenv/config";
import { codeRoutes } from "./routes/codeRoutes";
import { connectDB, disconnectDB } from "./database/db.setup";
import mongoose from "mongoose";
import { execFile } from "child_process";
import { promisify } from "util";
import { SandboxManager } from "./Services/sandboxManager";

const execFileAsync = promisify(execFile);

// Connect to MongoDB on startup
await connectDB();

const app = new Elysia()
  .use(
    cors({
      origin: process.env.CLIENT_URL || true,
    })
  )
  .use(codeRoutes)
  // Liveness check: confirms server process is responsive
  .get("/health", () => ({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  }))
  // Readiness check: verifies database connection and Docker availability
  .get("/ready", async ({ set }) => {
    const dbConnected = mongoose.connection.readyState === 1;
    let dockerAvailable = false;
    try {
      await execFileAsync("docker", ["version"], { timeout: 2000 });
      dockerAvailable = true;
    } catch {
      dockerAvailable = false;
    }

    const ready = dbConnected && dockerAvailable;
    set.status = ready ? 200 : 503;

    return {
      ready,
      database: dbConnected ? "connected" : "disconnected",
      docker: dockerAvailable ? "available" : "unavailable",
      activeExecutions: SandboxManager.getActiveRuns(),
      maxConcurrent: SandboxManager.getMaxConcurrent(),
    };
  })
  // Legacy status endpoints for backward compatibility
  .get("/status", () => ({ status: "OK" }))
  .get("/api/status", () => ({ status: "OK" }))
  .get("/api", () => "VisualizeX Execution API")
  .post("/api/execute", executeRouteHandler);

const port = parseInt(process.env.PORT || "5000", 10);
app.listen({ port });

console.log(`🦊 VisualizeX Elysia server is running at http://localhost:${port}`);

// Graceful shutdown
const shutdown = async (signal: string) => {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  try {
    await app.stop();
    await disconnectDB();
    console.log("Cleanup complete. Exiting process.");
    process.exit(0);
  } catch (err) {
    console.error("Error during shutdown:", err);
    process.exit(1);
  }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

export type App = typeof app;
export { app };
