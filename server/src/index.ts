import { Elysia } from "elysia";
import { executeRouteHandler } from "./controllers/codeExecution";
import cors from "@elysiajs/cors";

const app = new Elysia()
  .use(cors({ origin: "http://localhost:3000" })) // Allow requests from your frontend URL
  .get("/", () => "Hello, Elysia!")
  .post("/execute", executeRouteHandler) // Use the handler from executeCode.ts
  .listen(5000); // Set the port to 5000

console.log(
  `🦊 Elysia server is running at http://localhost:${app.server?.port}`
);
