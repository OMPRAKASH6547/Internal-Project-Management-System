import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import apiRoutes from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

export function createExpressApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || true,
      credentials: true,
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());
  app.use(morgan("dev"));
  app.use(rateLimit({ windowMs: 60 * 1000, max: 120 }));

  app.get("/api/v1/health", (req, res) => {
    res.json({ ok: true, service: "ipms-backend", timestamp: new Date().toISOString() });
  });

  app.use("/api/v1", apiRoutes);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
