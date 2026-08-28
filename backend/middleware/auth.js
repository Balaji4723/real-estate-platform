import jwt from "jsonwebtoken";

function getSecret() {
  return process.env.JWT_SECRET || "change-this-secret-in-production";
}

export function requireAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Authentication required." });
  }

  try {
    const payload = jwt.verify(token, getSecret());
    req.admin = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token. Please log in again." });
  }
}

export function signToken(payload) {
  return jwt.sign(payload, getSecret(), { expiresIn: "8h" });
}
