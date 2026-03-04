const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Property = require("./models/Property");

dotenv.config();

const seedData = async () => {
  try {
    // 1. Connect to DB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding... 🔌");

    // 2. Clear existing properties to avoid duplicates
    await Property.deleteMany();
    console.log("Existing properties cleared. 🗑️");

    // 3. Sample Properties Data
    const sampleProperties = [
      {
        title: "Luxury Bali Villa",
        listing_title: "Luxury Bali Villa",
        name: "Luxury Bali Villa",
        location: "Bali, Indonesia",
        price: 5000,
        images: [
          "https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=500&h=400&fit=crop",
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=400&fit=crop"
        ],
        description: "Beautiful luxury villa in the heart of Bali with stunning ocean views, private pool, and modern amenities. Perfect for a romantic getaway or family vacation.",
        maxGuests: 6,
        breadcrumbs: "Bali, Indonesia"
      },
      {
        title: "Cozy Apartment in Downtown",
        listing_title: "Cozy Apartment in Downtown",
        name: "Cozy Apartment in Downtown",
        location: "Mumbai, India",
        price: 2500,
        images: [
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=400&fit=crop",
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=400&fit=crop"
        ],
        description: "Modern and cozy apartment located in the vibrant downtown area. Walking distance to restaurants, shops, and public transportation.",
        maxGuests: 4,
        breadcrumbs: "Mumbai, India"
      },
      {
        title: "Beachfront House",
        listing_title: "Beachfront House",
        name: "Beachfront House",
        location: "Goa, India",
        price: 4200,
        images: [
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=400&fit=crop",
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=400&fit=crop"
        ],
        description: "Stunning beachfront property with direct access to the beach. Enjoy sunrise views, sea breeze, and the sound of waves. Perfect for beach lovers.",
        maxGuests: 5,
        breadcrumbs: "Goa, India"
      },
      {
        title: "Mountain Retreat Cabin",
        listing_title: "Mountain Retreat Cabin",
        name: "Mountain Retreat Cabin",
        location: "Himachal Pradesh, India",
        price: 2000,
        images: [
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=400&fit=crop",
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=400&fit=crop"
        ],
        description: "Peaceful mountain cabin surrounded by nature. Perfect for a quiet retreat with family. Enjoy hiking, fresh air, and stunning mountain views.",
        maxGuests: 4,
        breadcrumbs: "Himachal Pradesh, India"
      },
      {
        title: "Modern Bangkok Condo",
        listing_title: "Modern Bangkok Condo",
        name: "Modern Bangkok Condo",
        location: "Bangkok, Thailand",
        price: 3500,
        images: [
          "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&h=400&fit=crop",
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=400&fit=crop"
        ],
        description: "Contemporary condo in the heart of Bangkok with city views. Fully equipped with modern amenities, gym, and 24/7 security.",
        maxGuests: 3,
        breadcrumbs: "Bangkok, Thailand"
      },
      {
        title: "Tropical Island Bungalow",
        listing_title: "Tropical Island Bungalow",
        name: "Tropical Island Bungalow",
        location: "Maldives",
        price: 6500,
        images: [
          "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=400&fit=crop",
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=400&fit=crop"
        ],
        description: "Exclusive over-water bungalow with direct lagoon access. Crystal clear waters, private beach, and ultimate luxury experience.",
        maxGuests: 2,
        breadcrumbs: "Maldives"
      },
      {
        title: "Historic Heritage Mansion",
        listing_title: "Historic Heritage Mansion",
        name: "Historic Heritage Mansion",
        location: "Jaipur, India",
        price: 3800,
        images: [
          "https://images.unsplash.com/photo-1549887534-7eae0fdc17f0?w=500&h=400&fit=crop",
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=400&fit=crop"
        ],
        description: "Beautiful heritage property with traditional architecture. Experience royal hospitality with modern amenities in a historic setting.",
        maxGuests: 8,
        breadcrumbs: "Jaipur, India"
      },
      {
        title: "Lakeside Cottage",
        listing_title: "Lakeside Cottage",
        name: "Lakeside Cottage",
        location: "Nainital, India",
        price: 2800,
        images: [
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=400&fit=crop",
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=400&fit=crop"
        ],
        description: "Charming lakeside cottage with beautiful views. Perfect for a peaceful vacation with boating, fishing, and nature walks.",
        maxGuests: 5,
        breadcrumbs: "Nainital, India"
      }
    ];

    // 4. Insert Properties
    await Property.insertMany(sampleProperties);
    console.log(`✅ Successfully seeded ${sampleProperties.length} properties! 🚀`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error.message);
    process.exit(1);
  }
};

seedData();
