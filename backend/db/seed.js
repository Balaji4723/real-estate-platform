import { db } from "./index.js";

const seedProperties = [
  {
    title: "Sea-View Apartment near Marina Beach",
    location: "Chennai",
    address: "Besant Nagar, Chennai, Tamil Nadu",
    type: "Apartment",
    price: 6500000,
    bedrooms: 2,
    bathrooms: 2,
    area_sqft: 1100,
    description:
      "A breezy 2BHK just five minutes' walk from Marina Beach. Recently repainted, with a balcony that catches the sea air every evening. Covered parking and 24-hour security included.",
    status: "Available",
    images: ["seed/chennai-1.jpg", "seed/chennai-2.jpg", "seed/chennai-3.jpg"],
  },
  {
    title: "Andheri Hills Villa",
    location: "Mumbai",
    address: "Andheri West, Mumbai, Maharashtra",
    type: "Villa",
    price: 28500000,
    bedrooms: 3,
    bathrooms: 3,
    area_sqft: 2400,
    description:
      "Luxury 3BHK villa tucked into the Andheri hills with a private garden and double-height living room. Close to the metro, top schools, and the city's best restaurants.",
    status: "Available",
    images: ["seed/mumbai-1.jpg", "seed/mumbai-2.jpg", "seed/mumbai-3.jpg"],
  },
  {
    title: "Affordable Flat in Dwarka",
    location: "Delhi",
    address: "Dwarka Sector 12, New Delhi",
    type: "Flat",
    price: 4200000,
    bedrooms: 1,
    bathrooms: 1,
    area_sqft: 650,
    description:
      "A tidy 1BHK built for first-time buyers. Lift access, a dedicated two-wheeler spot, and a five-minute walk to the metro station. Move-in ready.",
    status: "Available",
    images: ["seed/delhi-1.jpg", "seed/delhi-2.jpg", "seed/delhi-3.jpg"],
  },
  {
    title: "Independent House in Whitefield",
    location: "Bangalore",
    address: "Whitefield, Bengaluru, Karnataka",
    type: "House",
    price: 11000000,
    bedrooms: 3,
    bathrooms: 2,
    area_sqft: 1800,
    description:
      "Standalone house on a quiet street in Whitefield, walking distance from the tech park. Sunlit rooms on every floor and space to add a home office.",
    status: "Available",
    images: ["seed/bangalore-1.jpg"],
  },
  {
    title: "Heritage Estate, ECR",
    location: "Chennai",
    address: "East Coast Road, Chennai, Tamil Nadu",
    type: "Estate",
    price: 45000000,
    bedrooms: 4,
    bathrooms: 4,
    area_sqft: 3800,
    description:
      "A sprawling estate on ECR with a private courtyard, staff quarters, and uninterrupted views of the coast. Built for entertaining, designed for quiet mornings.",
    status: "Available",
    images: ["seed/chennai-estate-1.jpg"],
  },
];

function seed() {
  const countRow = db.prepare("SELECT COUNT(*) AS count FROM properties").get();
  if (countRow.count > 0) {
    console.log(`Database already has ${countRow.count} properties — skipping seed.`);
    return;
  }

  const insertProperty = db.prepare(`
    INSERT INTO properties
      (title, location, address, type, price, bedrooms, bathrooms, area_sqft, description, status)
    VALUES
      (@title, @location, @address, @type, @price, @bedrooms, @bathrooms, @area_sqft, @description, @status)
  `);

  const insertImage = db.prepare(`
    INSERT INTO property_images (property_id, image_path, sort_order)
    VALUES (?, ?, ?)
  `);

  const run = db.transaction((items) => {
    for (const item of items) {
      const { images, ...propertyFields } = item;
      const result = insertProperty.run(propertyFields);
      const propertyId = result.lastInsertRowid;
      images.forEach((imagePath, index) => {
        insertImage.run(propertyId, `/uploads/${imagePath}`, index);
      });
    }
  });

  run(seedProperties);
  console.log(`Seeded ${seedProperties.length} properties.`);
}

seed();
