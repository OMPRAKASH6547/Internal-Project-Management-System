import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

function buildTokenPayload(user) {
  return {
    userId: String(user._id),
    email: user.email,
    role: user.role,
  };
}

export async function registerUser(payload) {
  const existing = await User.findOne({ email: payload.email });
  if (existing) {
    const err = new Error("Email already in use");
    err.statusCode = 409;
    throw err;
  }

  const password = await bcrypt.hash(payload.password, 12);
  const user = await User.create({ ...payload, password });
  return user;
}

export async function loginUser(payload) {
  const user = await User.findOne({ email: payload.email });
  if (!user) {
    const err = new Error("Invalid email or password");
    err.statusCode = 401;
    throw err;
  }

  const ok = await bcrypt.compare(payload.password, user.password);
  if (!ok) {
    const err = new Error("Invalid email or password");
    err.statusCode = 401;
    throw err;
  }

  return user;
}

export function issueAuthToken(user) {
  if (!process.env.JWT_SECRET) {
    const err = new Error("Missing JWT_SECRET environment variable.");
    err.statusCode = 500;
    throw err;
  }

  return jwt.sign(buildTokenPayload(user), process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}
