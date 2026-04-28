import http from "node:http";
import next from "next";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { createExpressApp } from "./src/app.js";
import { connectDatabase } from "./src/config/db.js";
import { initializeSockets } from "./src/sockets/index.js";

dotenv.config({ path: ".env.local" });
dotenv.config();

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOST || "0.0.0.0";
const port = Number(process.env.PORT || 3000);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

async function createServer() {
  await connectDatabase();
  await app.prepare();

  const expressApp = createExpressApp();
  const httpServer = http.createServer((req, res) => {
    if (req.url?.startsWith("/api/v1")) {
      expressApp(req, res);
      return;
    }
    handle(req, res);
  });
  const io = new Server(httpServer, {
    path: "/socket.io",
    cors: {
      origin: process.env.CORS_ORIGIN || "*",
      credentials: true,
    },
  });

  global.__io = io;
  expressApp.locals.io = io;
  await initializeSockets(io);

  httpServer.listen(port, hostname, () => {
    console.log(`Server ready on http://${hostname}:${port}`);
  });
}

createServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
