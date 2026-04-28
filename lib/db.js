import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

const globalForMongoose = globalThis;

if (!globalForMongoose.__mongooseConn) {
  globalForMongoose.__mongooseConn = { conn: null, promise: null };
}

export async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error("Missing MONGODB_URI environment variable.");
  }

  const cached = globalForMongoose.__mongooseConn;

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: process.env.MONGODB_DB || "internal-project-management",
      })
      .then((mongooseInstance) => mongooseInstance);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
