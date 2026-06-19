import { createClient } from "@libsql/client";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "data");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export const db = createClient({
  url: `file:${path.join(dataDir, "listings.db")}`,
});

await db.execute("PRAGMA journal_mode = WAL");
await db.execute("PRAGMA foreign_keys = ON");

await db.execute(`
  CREATE TABLE IF NOT EXISTS properties (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    title         TEXT NOT NULL,
    location      TEXT NOT NULL,
    address       TEXT,
    type          TEXT NOT NULL,
    price         INTEGER NOT NULL,
    bedrooms      INTEGER NOT NULL DEFAULT 0,
    bathrooms     INTEGER NOT NULL DEFAULT 0,
    area_sqft     INTEGER NOT NULL DEFAULT 0,
    description   TEXT NOT NULL DEFAULT '',
    status        TEXT NOT NULL DEFAULT 'Available',
    created_at    TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

await db.execute(`
  CREATE TABLE IF NOT EXISTS property_images (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    property_id   INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    image_path    TEXT NOT NULL,
    sort_order    INTEGER NOT NULL DEFAULT 0
  )
`);

await db.execute(`
  CREATE INDEX IF NOT EXISTS idx_images_property_id 
  ON property_images(property_id)
`);

export default db;