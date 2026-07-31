const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const autoSeed = async () => {
  try {
    const Property = require("../models/Property");
    const User = require("../models/User");
    const Booking = require("../models/Booking");
    const bcrypt = require("bcryptjs");

    const propertyCount = await Property.countDocuments();
    if (propertyCount > 0) return;

    console.log(" DB is empty. Seeding initial data...");

    let rawProperties = [];
    const jsonPath = path.join(__dirname, "../data/properties.json");
    if (fs.existsSync(jsonPath)) {
      rawProperties = JSON.parse(fs.readFileSync(jsonPath, "utf-8")).slice(0, 100);
    } else {
      rawProperties = [
        { title: "Luxury Bali Villa", location: "Bali, Indonesia", price: 5000, images: ["https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=500"], description: "Beautiful luxury villa in Bali", maxGuests: 6 },
        { title: "Cozy Downtown Apartment", location: "Mumbai, India", price: 2500, images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500"], description: "Modern apartment downtown", maxGuests: 4 },
        { title: "Beachfront House", location: "Goa, India", price: 4200, images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500"], description: "Stunning beachfront house", maxGuests: 5 }
      ];
    }

    const cleanedProperties = rawProperties.map((item) => {
      let finalImages = [];
      try {
        finalImages = typeof item.images === "string" ? JSON.parse(item.images) : (Array.isArray(item.images) ? item.images : []);
      } catch (e) {
        finalImages = item.image ? [item.image.replace(/"/g, "")] : ["https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=500"];
      }
      return {
        listing_title: item.listing_title || item.name || item.title || "Bali Stay",
        name: item.name || item.listing_title || item.title,
        title: item.title || item.listing_title || item.name,
        location: item.location || item.breadcrumbs || "Bali, Indonesia",
        price: item.price || 3200,
        images: finalImages.length ? finalImages : ["https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=500"],
        description: item.description || "A beautiful property in the heart of Bali.",
        maxGuests: item.guests || item.maxGuests || 2,
        breadcrumbs: item.breadcrumbs || item.location
      };
    });

    await Property.insertMany(cleanedProperties);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    const users = await User.insertMany([
      { name: "John Doe", email: "john@example.com", password: hashedPassword, role: "user" },
      { name: "Jane Host", email: "jane@example.com", password: hashedPassword, isHost: true, role: "host", hostDescription: "Experienced host" },
      { name: "Alice User", email: "alice@example.com", password: hashedPassword }
    ]);

    const host = users.find(u => u.isHost);
    const someProps = await Property.find().limit(3);
    await Property.updateMany({ _id: { $in: someProps.map(p => p._id) } }, { host: host._id });

    const user1 = users.find(u => u.email === "john@example.com");
    const user2 = users.find(u => u.email === "alice@example.com");
    const sampleProps = await Property.find().limit(2);

    await Booking.insertMany([
      {
        user: user1._id,
        property: sampleProps[0]._id,
        fromDate: new Date("2026-08-10"),
        toDate: new Date("2026-08-15"),
        guests: 2,
        totalPrice: sampleProps[0].price * 5
      },
      {
        user: user2._id,
        property: sampleProps[1]._id,
        fromDate: new Date("2026-08-20"),
        toDate: new Date("2026-08-22"),
        guests: 1,
        totalPrice: sampleProps[1].price * 2
      }
    ]);

    console.log(" Initial data seeded successfully! 🚀");
  } catch (err) {
    console.error(" Auto-seed warning:", err.message);
  }
};

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || "mongodb://localhost:27017/airbnb";
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
      socketTimeoutMS: 45000,
    });
    console.log(" MongoDB connected successfully");
    await autoSeed();
  } catch (error) {
    console.warn(" Could not connect to primary MongoDB:", error.message);
    try {
      const { MongoMemoryServer } = require("mongodb-memory-server");
      console.log(" Starting in-memory MongoDB fallback server...");
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log(" MongoDB connected successfully (In-Memory Database)");
      await autoSeed();
    } catch (memErr) {
      console.error(" MongoDB connection failed completely:", memErr.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;