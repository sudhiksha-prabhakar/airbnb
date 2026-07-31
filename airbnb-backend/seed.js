const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const Property = require("./models/Property");
const User = require("./models/User");
const Booking = require("./models/Booking");

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

    // 6. Seed users
    const bcrypt = require("bcryptjs");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    await User.deleteMany();
    console.log("Existing users cleared.");

    const users = await User.insertMany([
      { name: "Admin System", email: "admin@example.com", password: hashedPassword, role: "admin", isHost: true },
      { name: "John Doe", email: "john@example.com", password: hashedPassword, role: "user" },
      { name: "Jane Host", email: "jane@example.com", password: hashedPassword, isHost: true, role: "host", hostDescription: "Experienced host" },
      { name: "Alice User", email: "alice@example.com", password: hashedPassword }
    ]);
    console.log(`Successfully seeded ${users.length} users (including Admin)! 👥`);

    // 7. Assign host to some properties
    const host = users.find(u => u.isHost);
    const someProperties = await Property.find().limit(3);
    await Property.updateMany({ _id: { $in: someProperties.map(p => p._id) } }, { host: host._id });
    console.log("Assigned host to properties! 🏠");

    // 8. Seed bookings
    await Booking.deleteMany();
    console.log("Existing bookings cleared.");

    const user1 = users.find(u => u.email === "john@example.com");
    const user2 = users.find(u => u.email === "alice@example.com");
    const properties = await Property.find().limit(2);

    const bookings = await Booking.insertMany([
      {
        user: user1._id,
        property: properties[0]._id,
        fromDate: new Date("2026-08-10"),
        toDate: new Date("2026-08-15"),
        guests: 2,
        totalPrice: properties[0].price * 5
      },
      {
        user: user2._id,
        property: properties[1]._id,
        fromDate: new Date("2026-08-20"),
        toDate: new Date("2026-08-22"),
        guests: 1,
        totalPrice: properties[1].price * 2
      }
    ]);
    console.log(`Successfully seeded ${bookings.length} bookings! 📅`);
    
    process.exit();
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();