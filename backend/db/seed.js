import { db } from "./index.js";

const seedProperties = [
  {
    title: "Sea-View Apartment near Marina Beach",
    location: "Chennai",
    address: "Besant Nagar, Chennai, Tamil Nadu",
    type: "Apartment",
    price: 6500000,
    bedrooms: 2, bathrooms: 2, area_sqft: 1100,
    description: "A breezy 2BHK just five minutes walk from Marina Beach. Recently repainted, with a balcony that catches the sea air every evening.",
    status: "Available",
    images: ["seed/chennai-1.jpg", "seed/chennai-2.jpg", "seed/chennai-3.jpg"],
  },
  {
    title: "Andheri Hills Villa",
    location: "Mumbai",
    address: "Andheri West, Mumbai, Maharashtra",
    type: "Villa",
    price: 28500000,
    bedrooms: 3, bathrooms: 3, area_sqft: 2400,
    description: "Luxury 3BHK villa tucked into the Andheri hills with a private garden and double-height living room.",
    status: "Available",
    images: ["seed/mumbai-1.jpg", "seed/mumbai-2.jpg", "seed/mumbai-3.jpg"],
  },
  {
    title: "Affordable Flat in Dwarka",
    location: "Delhi",
    address: "Dwarka Sector 12, New Delhi",
    type: "Flat",
    price: 4200000,
    bedrooms: 1, bathrooms: 1, area_sqft: 650,
    description: "A tidy 1BHK built for first-time buyers. Lift access and five minutes walk to the metro.",
    status: "Available",
    images: ["seed/delhi-1.jpg", "seed/delhi-2.jpg", "seed/delhi-3.jpg"],
  },
  {
    title: "Independent House in Whitefield",
    location: "Bangalore",
    address: "Whitefield, Bengaluru, Karnataka",
    type: "House",
    price: 11000000,
    bedrooms: 3, bathrooms: 2, area_sqft: 1800,
    description: "Standalone house on a quiet street in Whitefield, walking distance from the tech park.",
    status: "Available",
    images: ["seed/bangalore-1.jpg"],
  },
  {
    title: "Heritage Estate, ECR",
    location: "Chennai",
    address: "East Coast Road, Chennai, Tamil Nadu",
    type: "Estate",
    price: 45000000,
    bedrooms: 4, bathrooms: 4, area_sqft: 3800,
    description: "A sprawling estate on ECR with a private courtyard and uninterrupted views of the coast.",
    status: "Available",
    images: ["seed/chennai-estate-1.jpg"],
  },
];

async function seed() {
  const result = await db.execute("SELECT COUNT(*) AS count FROM properties");
  const count = result.rows[0].count;
  if (count > 0) {
    console.log(`Database already has ${count} properties — skipping seed.`);
    return;
  }

  for (const item of seedProperties) {
    const { images, ...fields } = item;
    const res = await db.execute({
      sql: `INSERT INTO properties
        (title, location, address, type, price, bedrooms, bathrooms, area_sqft, description, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [fields.title, fields.location, fields.address, fields.type,
             fields.price, fields.bedrooms, fields.bathrooms,
             fields.area_sqft, fields.description, fields.status],
    });
    const propertyId = res.lastInsertRowid;
    for (let i = 0; i < images.length; i++) {
      await db.execute({
        sql: "INSERT INTO property_images (property_id, image_path, sort_order) VALUES (?, ?, ?)",
        args: [propertyId, `/uploads/${images[i]}`, i],
      });
    }
  }
  console.log(`Seeded ${seedProperties.length} properties.`);
}

await seed();