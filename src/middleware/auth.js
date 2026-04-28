import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  try {
    const cookieName = process.env.AUTH_COOKIE_NAME || "ipms_token";
    const tokenFromCookie = req.cookies?.[cookieName];
    const authHeader = req.headers.authorization;
    const tokenFromHeader = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    const token = tokenFromCookie || tokenFromHeader;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ error: "Missing JWT_SECRET environment variable." });
    }

    req.user = jwt.verify(token, secret);
    return next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
}
