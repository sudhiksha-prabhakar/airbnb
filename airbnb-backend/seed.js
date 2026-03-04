const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const Property = require("./models/Property");

dotenv.config();

const seedData = async () => {
  try {
    // 1. Connect to DB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding... 🔌");

    // 2. Read your JSON file
    const rawData = JSON.parse(fs.readFileSync("./data/properties.json", "utf-8"));

    // 3. Clear existing properties to avoid duplicates
    await Property.deleteMany();
    console.log("Existing properties cleared. 🗑️");

    // 4. Clean and Format Data
    const cleanedData = rawData.map((item) => {
      let finalImages = [];
      try {
        // Handle the stringified array format: "["url1", "url2"]"
        finalImages = typeof item.images === "string" ? JSON.parse(item.images) : [];
      } catch (e) {
        // Fallback for single image strings
        finalImages = item.image ? [item.image.replace(/"/g, "")] : [];
      }

      return {
        listing_title: item.listing_title || item.name || "Bali Stay",
        name: item.name || item.listing_title,
        location: item.location || item.breadcrumbs || "Bali, Indonesia",
        price: item.price || 3200, // Default price if null
        images: finalImages,
        description: item.description || "A beautiful property in the heart of Bali.",
        maxGuests: item.guests || 2,
        breadcrumbs: item.breadcrumbs
      };
    });

    // 5. Bulk Insert
    await Property.insertMany(cleanedData);
    console.log(`Successfully seeded ${cleanedData.length} properties! 🚀`);
    
    process.exit();
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();