import mongoose from "mongoose";

const globalForMongoose = globalThis;
if (!globalForMongoose.__expressMongoose) {
  globalForMongoose.__expressMongoose = { conn: null, promise: null };
}

export async function connectDatabase() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error("Missing MONGODB_URI environment variable.");
  }

  const cached = globalForMongoose.__expressMongoose;
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, { dbName: process.env.MONGODB_DB || "internal-project-management" })
      .then((instance) => instance);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
