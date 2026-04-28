import jwt from "jsonwebtoken";
import { createAdapter } from "@socket.io/redis-adapter";
import { getRedisClient } from "../config/redis.js";
import Project from "../models/Project.js";

function hasProjectAccess(project, userId) {
  const uid = String(userId);
  if (String(project.ownerId) === uid) return true;
  if (project.members?.some((entry) => String(entry.userId) === uid)) return true;
  return project.memberIds?.some((memberId) => String(memberId) === uid);
}

export async function initializeSockets(io) {
  io.use((socket, next) => {
    try {
      const cookieName = process.env.AUTH_COOKIE_NAME || "ipms_token";
      const cookieHeader = socket.handshake.headers?.cookie || "";
      const cookieToken = cookieHeader
        .split(";")
        .map((item) => item.trim())
        .find((item) => item.startsWith(`${cookieName}=`))
        ?.split("=")[1];

      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace("Bearer ", "") ||
        cookieToken;
      if (!token) return next(new Error("Unauthorized"));
      if (!process.env.JWT_SECRET) return next(new Error("Missing JWT secret"));
      socket.user = jwt.verify(token, process.env.JWT_SECRET);
      return next();
    } catch {
      return next(new Error("Unauthorized"));
    }
  });

  const redisClient = getRedisClient();
  if (redisClient) {
    try {
      const pubClient = redisClient;
      const subClient = pubClient.duplicate();

      pubClient.on("error", () => {});
      subClient.on("error", () => {});

      await Promise.all([
        pubClient.ping(),
        subClient.connect ? subClient.connect().catch(() => null) : Promise.resolve(),
      ]);

      io.adapter(createAdapter(pubClient, subClient));
    } catch {
      // If Redis is unavailable locally, continue with in-memory adapter.
    }
  }

  io.on("connection", (socket) => {
    socket.join(`user:${socket.user.userId}`);

    socket.on("project:join", async ({ projectId }) => {
      try {
        if (!projectId) return;
        const project = await Project.findById(projectId).select("_id ownerId memberIds members");
        if (!project) return;
        if (!hasProjectAccess(project, socket.user.userId)) return;
        socket.join(`project:${projectId}`);
      } catch {
        // Ignore join errors to keep socket healthy.
      }
    });

    socket.on("project:leave", ({ projectId }) => {
      if (!projectId) return;
      socket.leave(`project:${projectId}`);
    });
  });
}
