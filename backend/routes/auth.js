import express from "express";
import bcrypt from "bcryptjs";
import rateLimit from "express-rate-limit";
import { signToken } from "../middleware/auth.js";

const router = express.Router();

// Strict rate limit for login: 10 attempts per 15 minutes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many login attempts. Try again in 15 minutes." },
});

router.post("/login", loginLimiter, async (req, res) => {
  const { password } = req.body;

  if (!password || typeof password !== "string" || password.length > 128) {
    return res.status(400).json({ error: "Password is required." });
  }

  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) {
    return res.status(500).json({ error: "Admin credentials not configured." });
  }

  try {
    const valid = await bcrypt.compare(password, hash);
    if (!valid) {
      return res.status(401).json({ error: "Incorrect password." });
    }

    const token = signToken({ role: "admin" });
    res.json({ token, expiresIn: "8h" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed." });
  }
});

export default router;
