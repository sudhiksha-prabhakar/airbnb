const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // Wait 10 seconds for the shard to respond
      socketTimeoutMS: 45000,
    });
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    console.log("💡 TIP: If name resolution fails, check if you are on a Mobile Hotspot.");
    process.exit(1);
  }
};

module.exports = connectDB;