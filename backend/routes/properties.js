import express from "express";
import path from "path";
import fs from "fs";
import { db } from "../db/index.js";
import { upload, uploadsDir } from "../middleware/upload.js";

const router = express.Router();

const getImagesStmt = db.prepare(
  "SELECT image_path FROM property_images WHERE property_id = ? ORDER BY sort_order ASC, id ASC"
);

function attachImages(property) {
  const rows = getImagesStmt.all(property.id);
  return { ...property, images: rows.map((r) => r.image_path) };
}

function attachImagesToAll(properties) {
  return properties.map(attachImages);
}

// GET /api/properties — list with optional filters
router.get("/", (req, res) => {
  const { search, location, type, minPrice, maxPrice, bedrooms, status } = req.query;

  const clauses = [];
  const params = {};

  if (search) {
    clauses.push("(title LIKE @search OR location LIKE @search OR address LIKE @search OR type LIKE @search)");
    params.search = `%${search}%`;
  }
  if (location) {
    clauses.push("location = @location");
    params.location = location;
  }
  if (type) {
    clauses.push("type = @type");
    params.type = type;
  }
  if (minPrice) {
    clauses.push("price >= @minPrice");
    params.minPrice = Number(minPrice);
  }
  if (maxPrice) {
    clauses.push("price <= @maxPrice");
    params.maxPrice = Number(maxPrice);
  }
  if (bedrooms) {
    clauses.push("bedrooms >= @bedrooms");
    params.bedrooms = Number(bedrooms);
  }
  if (status) {
    clauses.push("status = @status");
    params.status = status;
  }

  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const sql = `SELECT * FROM properties ${where} ORDER BY datetime(created_at) DESC, id DESC`;

  try {
    const rows = db.prepare(sql).all(params);
    res.json(attachImagesToAll(rows));
  } catch (err) {
    console.error("Failed to list properties:", err);
    res.status(500).json({ error: "Could not load properties." });
  }
});

// GET /api/properties/meta — distinct locations & types for filter UI
router.get("/meta", (req, res) => {
  try {
    const locations = db
      .prepare("SELECT DISTINCT location FROM properties ORDER BY location ASC")
      .all()
      .map((r) => r.location);
    const types = db
      .prepare("SELECT DISTINCT type FROM properties ORDER BY type ASC")
      .all()
      .map((r) => r.type);
    res.json({ locations, types });
  } catch (err) {
    console.error("Failed to load meta:", err);
    res.status(500).json({ error: "Could not load filter options." });
  }
});

// GET /api/properties/stats — aggregate numbers for the hero strip
router.get("/stats", (req, res) => {
  try {
    const totals = db
      .prepare(
        `SELECT
           COUNT(*) AS totalProperties,
           COUNT(DISTINCT location) AS totalCities,
           COALESCE(AVG(price), 0) AS avgPrice,
           SUM(CASE WHEN status = 'Available' THEN 1 ELSE 0 END) AS totalAvailable
         FROM properties`
      )
      .get();
    res.json(totals);
  } catch (err) {
    console.error("Failed to load stats:", err);
    res.status(500).json({ error: "Could not load stats." });
  }
});

// GET /api/properties/:id — single property
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "Invalid property id." });
  }
  const property = db.prepare("SELECT * FROM properties WHERE id = ?").get(id);
  if (!property) {
    return res.status(404).json({ error: "Property not found." });
  }
  res.json(attachImages(property));
});

// POST /api/properties — create a new listing (multipart/form-data)
router.post("/", upload.array("images", 8), (req, res) => {
  const { title, location, address, type, price, bedrooms, bathrooms, area_sqft, description, status } =
    req.body;

  if (!title || !location || !type || !price || !description) {
    return res.status(400).json({
      error: "Title, location, type, price, and description are required.",
    });
  }

  const priceNum = Number(price);
  if (!Number.isFinite(priceNum) || priceNum <= 0) {
    return res.status(400).json({ error: "Price must be a positive number." });
  }

  try {
    const insertProperty = db.prepare(`
      INSERT INTO properties
        (title, location, address, type, price, bedrooms, bathrooms, area_sqft, description, status)
      VALUES
        (@title, @location, @address, @type, @price, @bedrooms, @bathrooms, @area_sqft, @description, @status)
    `);

    const result = insertProperty.run({
      title,
      location,
      address: address || "",
      type,
      price: priceNum,
      bedrooms: Number(bedrooms) || 0,
      bathrooms: Number(bathrooms) || 0,
      area_sqft: Number(area_sqft) || 0,
      description,
      status: status || "Available",
    });

    const propertyId = result.lastInsertRowid;
    const insertImage = db.prepare(
      "INSERT INTO property_images (property_id, image_path, sort_order) VALUES (?, ?, ?)"
    );

    const files = req.files || [];
    files.forEach((file, index) => {
      insertImage.run(propertyId, `/uploads/${file.filename}`, index);
    });

    const created = db.prepare("SELECT * FROM properties WHERE id = ?").get(propertyId);
    res.status(201).json(attachImages(created));
  } catch (err) {
    console.error("Failed to create property:", err);
    res.status(500).json({ error: "Could not save the property." });
  }
});

// DELETE /api/properties/:id — remove a listing and its uploaded images
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "Invalid property id." });
  }

  const existing = db.prepare("SELECT * FROM properties WHERE id = ?").get(id);
  if (!existing) {
    return res.status(404).json({ error: "Property not found." });
  }

  const images = getImagesStmt.all(id);

  try {
    db.prepare("DELETE FROM properties WHERE id = ?").run(id);

    // Only remove files that were actually uploaded by users, never the seed photos.
    images.forEach(({ image_path }) => {
      if (image_path.startsWith("/uploads/") && !image_path.startsWith("/uploads/seed/")) {
        const filePath = path.join(uploadsDir, image_path.replace("/uploads/", ""));
        fs.unlink(filePath, () => {});
      }
    });

    res.status(204).end();
  } catch (err) {
    console.error("Failed to delete property:", err);
    res.status(500).json({ error: "Could not delete the property." });
  }
});

export default router;
