# Sitemap — Real Estate Listings

A full-stack real estate listing platform styled with an architectural
blueprint/paper theme. Browse properties, filter by city, price and type,
view full details, add new listings with photos, and remove old ones — all
data is saved permanently in a local SQLite database.

---

## Stack

| Layer    | Technology                                              |
|----------|---------------------------------------------------------|
| Frontend | React 18 + Vite + Tailwind CSS v3 + Framer Motion      |
| Backend  | Node.js (ESM) + Express + better-sqlite3 + multer      |
| Database | SQLite (file: `backend/data/listings.db`)               |
| Fonts    | Space Grotesk · Inter · IBM Plex Mono (Google Fonts)   |

---

## Requirements

- **Node.js 18+** (v20 or v22 recommended)
- npm 9+
- An internet connection for the first `npm install` (packages only, not at runtime)

---

## Quick start — two terminals

### Terminal 1 — backend API (port 5050)

```bash
cd backend
npm install
npm run dev        # or: npm start
```

The first run seeds 5 demo properties from the included photos automatically.

### Terminal 2 — frontend dev server (port 5173)

```bash
cd frontend
npm install
npm run dev
```

Then open **http://localhost:5173** in your browser.

---

## One-command start (optional)

From the project root, install `concurrently` and run both servers together:

```bash
npm install concurrently --save-dev
npx concurrently "cd backend && npm run dev" "cd frontend && npm run dev"
```

---

## Features

- **Browse & search** — live-filtered grid by city, property type, price band, and bedroom count
- **Property cards** — architectural spec-sheet style with a sliding image carousel and crop-mark corners
- **Property detail modal** — full photo gallery with thumbnail strip, specs, description, and listing age
- **Add a property** — form with multi-image upload (up to 8 photos, max 8 MB each); saves to the database permanently
- **Remove a listing** — delete button inside the modal; cleans up uploaded files automatically
- **Paper / Blueprint toggle** — the signature design element; switches between a warm paper palette and a dark blueprint grid; preference is remembered in localStorage
- **Indian price formatting** — prices display as ₹65 L, ₹2.85 Cr, etc.
- **Animated hero stats strip** — live count-up of total listings, cities, live properties and average price

---

## Project structure

```
real-estate-platform/
├── backend/
│   ├── db/
│   │   ├── index.js          # SQLite schema (properties + property_images)
│   │   └── seed.js           # Idempotent demo-data seeder
│   ├── middleware/
│   │   └── upload.js         # Multer config (disk storage, 8 MB limit)
│   ├── routes/
│   │   └── properties.js     # REST: GET / GET /meta /stats /:id, POST, DELETE
│   ├── uploads/
│   │   └── seed/             # Demo photos (never deleted by the app)
│   ├── server.js             # Express entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/       # All UI components
    │   ├── context/          # Toast notification context
    │   ├── hooks/            # useProperties, useMeta, useStats, useCountUp, useDebounce
    │   ├── lib/              # api.js (fetch wrapper) + format.js (INR / area / time)
    │   ├── App.jsx           # Root layout + state
    │   ├── main.jsx          # ReactDOM entry
    │   └── index.css         # Tailwind directives + base theme
    ├── index.html
    ├── tailwind.config.js
    ├── vite.config.js        # dev proxy → :5050
    └── package.json
```

---

## API reference

| Method | Path                     | Description                         |
|--------|--------------------------|-------------------------------------|
| GET    | /api/properties          | List all, with optional filters      |
| GET    | /api/properties/meta     | Distinct cities and types            |
| GET    | /api/properties/stats    | Aggregate counts and average price   |
| GET    | /api/properties/:id      | Single property with images          |
| POST   | /api/properties          | Create listing (multipart/form-data) |
| DELETE | /api/properties/:id      | Remove listing and uploaded files    |
| GET    | /api/health              | Health check                         |

Query params for `GET /api/properties`: `search`, `location`, `type`, `minPrice`, `maxPrice`, `bedrooms`, `status`

---

## Design tokens (Tailwind)

| Token         | Hex       | Used for                              |
|---------------|-----------|---------------------------------------|
| `paper`       | `#EFEDE4` | Light-mode background                 |
| `navy`        | `#16263E` | Hero, dark-mode background, blueprint |
| `chalk`       | `#8FB8DA` | Blueprint grid lines, borders         |
| `brass`       | `#B6883B` | CTAs, prices, focus rings, accents    |
| `moss`        | `#3F7D58` | "Available" status badge              |
| `clay`        | `#A2462D` | "Sold", delete action, error toasts   |
| `ink`         | `#23262B` | Body text (light mode)                |
