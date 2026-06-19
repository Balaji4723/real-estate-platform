import express from "express";
import path from "path";
import fs from "fs";
import { db } from "../db/index.js";
import { upload, uploadsDir } from "../middleware/upload.js";

const router = express.Router();

async function getImages(propertyId) {
  const res = await db.execute({
    sql: "SELECT image_path FROM property_images WHERE property_id = ? ORDER BY sort_order ASC, id ASC",
    args: [propertyId],
  });
  return res.rows.map((r) => r.image_path);
}

async function attachImages(property) {
  const images = await getImages(property.id);
  return { ...property, images };
}

// GET /api/properties
router.get("/", async (req, res) => {
  try {
    const { search, location, type, minPrice, maxPrice, bedrooms, status } = req.query;
    const clauses = [];
    const args = [];

    if (search) { clauses.push("(title LIKE ? OR location LIKE ? OR address LIKE ? OR type LIKE ?)"); args.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`); }
    if (location) { clauses.push("location = ?"); args.push(location); }
    if (type) { clauses.push("type = ?"); args.push(type); }
    if (minPrice) { clauses.push("price >= ?"); args.push(Number(minPrice)); }
    if (maxPrice) { clauses.push("price <= ?"); args.push(Number(maxPrice)); }
    if (bedrooms) { clauses.push("bedrooms >= ?"); args.push(Number(bedrooms)); }
    if (status) { clauses.push("status = ?"); args.push(status); }

    const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
    const result = await db.execute({ sql: `SELECT * FROM properties ${where} ORDER BY datetime(created_at) DESC, id DESC`, args });
    const rows = await Promise.all(result.rows.map(attachImages));
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load properties." });
  }
});

// GET /api/properties/meta
router.get("/meta", async (req, res) => {
  try {
    const loc = await db.execute("SELECT DISTINCT location FROM properties ORDER BY location ASC");
    const typ = await db.execute("SELECT DISTINCT type FROM properties ORDER BY type ASC");
    res.json({ locations: loc.rows.map((r) => r.location), types: typ.rows.map((r) => r.type) });
  } catch (err) {
    res.status(500).json({ error: "Could not load filter options." });
  }
});

// GET /api/properties/stats
router.get("/stats", async (req, res) => {
  try {
    const result = await db.execute(`
      SELECT COUNT(*) AS totalProperties, COUNT(DISTINCT location) AS totalCities,
        COALESCE(AVG(price), 0) AS avgPrice,
        SUM(CASE WHEN status = 'Available' THEN 1 ELSE 0 END) AS totalAvailable
      FROM properties`);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Could not load stats." });
  }
});

// GET /api/properties/:id
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const result = await db.execute({ sql: "SELECT * FROM properties WHERE id = ?", args: [id] });
    if (!result.rows.length) return res.status(404).json({ error: "Property not found." });
    res.json(await attachImages(result.rows[0]));
  } catch (err) {
    res.status(500).json({ error: "Could not load property." });
  }
});

// POST /api/properties
router.post("/", upload.array("images", 8), async (req, res) => {
  const { title, location, address, type, price, bedrooms, bathrooms, area_sqft, description, status } = req.body;
  if (!title || !location || !type || !price || !description)
    return res.status(400).json({ error: "Title, location, type, price, and description are required." });

  try {
    const result = await db.execute({
      sql: `INSERT INTO properties (title, location, address, type, price, bedrooms, bathrooms, area_sqft, description, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [title, location, address || "", type, Number(price),
             Number(bedrooms) || 0, Number(bathrooms) || 0,
             Number(area_sqft) || 0, description, status || "Available"],
    });
    const propertyId = result.lastInsertRowid;
    const files = req.files || [];
    for (let i = 0; i < files.length; i++) {
      await db.execute({ sql: "INSERT INTO property_images (property_id, image_path, sort_order) VALUES (?, ?, ?)", args: [propertyId, `/uploads/${files[i].filename}`, i] });
    }
    const created = await db.execute({ sql: "SELECT * FROM properties WHERE id = ?", args: [propertyId] });
    res.status(201).json(await attachImages(created.rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not save the property." });
  }
});

// DELETE /api/properties/:id
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const existing = await db.execute({ sql: "SELECT * FROM properties WHERE id = ?", args: [id] });
    if (!existing.rows.length) return res.status(404).json({ error: "Property not found." });

    const images = await getImages(id);
    await db.execute({ sql: "DELETE FROM properties WHERE id = ?", args: [id] });

    images.forEach((image_path) => {
      if (image_path.startsWith("/uploads/") && !image_path.startsWith("/uploads/seed/")) {
        const filePath = path.join(uploadsDir, image_path.replace("/uploads/", ""));
        fs.unlink(filePath, () => {});
      }
    });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: "Could not delete the property." });
  }
});

export default router;