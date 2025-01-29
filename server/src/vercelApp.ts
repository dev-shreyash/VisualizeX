import { Elysia } from "elysia";
import { executeRouteHandler } from "./controllers/codeExecution";
import cors from "@elysiajs/cors";
import "dotenv/config";
import { getServerStatus } from "./helper/fetchStatus";

const app = new Elysia()
  .use(cors({ origin: process.env.CLIENT_URL })) // Allow requests from frontend
  .get("/", () => "Hello, Elysia!") // Default route
  .post("/execute", executeRouteHandler) // Code execution API
  .get("/status", getServerStatus); // Server status API

// Export handler for Vercel
export default app.handle;
