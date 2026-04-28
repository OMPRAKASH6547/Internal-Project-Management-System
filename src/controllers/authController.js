import { issueAuthToken, loginUser, registerUser } from "../services/authService.js";
import User from "../models/User.js";

function setAuthCookie(res, token) {
  res.cookie(process.env.AUTH_COOKIE_NAME || "ipms_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function serializeUser(user) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export async function register(req, res, next) {
  try {
    const user = await registerUser(req.validatedBody);
    const token = issueAuthToken(user);
    setAuthCookie(res, token);
    res.status(201).json({ user: serializeUser(user) });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const user = await loginUser(req.validatedBody);
    const token = issueAuthToken(user);
    setAuthCookie(res, token);
    res.json({ user: serializeUser(user) });
  } catch (error) {
    next(error);
  }
}

export async function me(req, res, next) {
  try {
    const user = await User.findById(req.user.userId).select("_id name email role");
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    res.json({ user: serializeUser(user) });
  } catch (error) {
    next(error);
  }
}

export function logout(req, res) {
  res.cookie(process.env.AUTH_COOKIE_NAME || "ipms_token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.json({ message: "Logged out" });
}
