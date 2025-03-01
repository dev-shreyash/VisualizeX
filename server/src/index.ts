import { Elysia } from "elysia";
import { executeRouteHandler } from "./controllers/codeExecution";
import cors from "@elysiajs/cors";
import "dotenv/config";
import { getServerStatus } from "./helper/fetchStatus";
import { codeRoutes } from "./routes/codeRoutes";
import { connectDB } from "./database/db.setup";
import { keepServerAlive } from "./helper/keepAlive";


// Connect to MongoDB
connectDB();

keepServerAlive();

const app = new Elysia()
  .use(cors({ origin: process.env.CLIENT_URL })) // Allow requests from your frontend URL
  .use(codeRoutes)
  .get("/api", () => "Hello, Elysia!") // Default route is now "/api"
  .post("/api/execute", executeRouteHandler) // Execute code handler route is now "/api/execute"
  .get("/api/status", getServerStatus) // Server status route is now "/api/status"
  .listen({
    port: 5000,
    hostname: "0.0.0.0"
  }); // Set the port to 5000

  console.log(process.env.CLIENT_URL)

console.log(
  `🦊 Elysia server is running at http://localhost:${app.server?.port}/api`
);
