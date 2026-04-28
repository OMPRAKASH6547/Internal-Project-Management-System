import Redis from "ioredis";
import { createAdapter } from "@socket.io/redis-adapter";

const REDIS_URL = process.env.REDIS_URL;

function createRedisClient() {
  if (!REDIS_URL) {
    return null;
  }

  return new Redis(REDIS_URL, {
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
  });
}

export async function getSocketIoRedisAdapter() {
  if (!REDIS_URL) {
    return null;
  }

  const pubClient = createRedisClient();
  const subClient = pubClient.duplicate();

  await Promise.all([pubClient.connect?.(), subClient.connect?.()].map((p) => p || Promise.resolve()));
  return createAdapter(pubClient, subClient);
}
