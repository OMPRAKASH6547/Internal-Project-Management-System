import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "ipms_token";

function getJwtSecret() {
  if (!JWT_SECRET) {
    throw new Error("Missing JWT_SECRET environment variable.");
  }
  return JWT_SECRET;
}

export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

export function signAccessToken(payload) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: JWT_EXPIRES_IN });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, getJwtSecret());
}

export function readTokenFromRequest(request) {
  const cookieToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (cookieToken) {
    return cookieToken;
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.replace("Bearer ", "");
  }

  return null;
}

export function requireAuth(request) {
  const token = readTokenFromRequest(request);
  if (!token) {
    throw new Error("Unauthorized");
  }

  return verifyAccessToken(token);
}

export function attachAuthCookie(response, token) {
  response.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}

export function clearAuthCookie(response) {
  response.cookies.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });
  return response;
}

export function unauthorizedResponse(message = "Unauthorized") {
  return NextResponse.json({ error: message }, { status: 401 });
}
