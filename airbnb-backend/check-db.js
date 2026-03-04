const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Property = require("./models/Property");

dotenv.config();

const checkDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB... 🔌");

    const count = await Property.countDocuments();
    console.log(`\n📊 Total properties in database: ${count}\n`);

    if (count > 0) {
      const sample = await Property.find().limit(5);
      console.log("Sample properties:");
      sample.forEach((p, i) => {
        console.log(`${i + 1}. ${p.listing_title || p.name || p.title} - ₹${p.price} @ ${p.location}`);
      });
    } else {
      console.log("❌ No properties found! Run: node seed-sample.js");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

checkDatabase();
