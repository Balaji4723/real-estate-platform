import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import "./db/index.js"; // ensures the schema exists before anything else runs
import "./db/seed.js"; // idempotent: only inserts demo listings the first time
import propertiesRouter from "./routes/properties.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 5050;

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Real estate API is running." });
});

app.use("/api/properties", propertiesRouter);

// Friendly fallback for unknown API routes
app.use("/api", (req, res) => {
  res.status(404).json({ error: "Not found." });
});

// Multer/validation errors land here instead of crashing the server
app.use((err, req, res, next) => {
  console.error(err);
  res.status(400).json({ error: err.message || "Something went wrong." });
});

app.listen(PORT, () => {
  console.log(`Real estate API listening on http://localhost:${PORT}`);
});
