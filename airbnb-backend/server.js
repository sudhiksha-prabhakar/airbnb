const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

const mongoose = require("mongoose");

mongoose.connection.once("open", async () => {
  console.log(" Connected DB name:", mongoose.connection.db.databaseName);

  const collections = await mongoose.connection.db
    .listCollections()
    .toArray();

  console.log(
    "Collections in this DB:",
    collections.map((c) => c.name)
  );
});

const app = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/properties", require("./routes/propertyRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

app.get('/',(req,res)=>{
  res.send("Welcome to Backend")
})

// Health check
app.get("/", (req, res) => {
  res.send("Airbnb backend running ");
});

// Debug endpoint to check database integrity
app.get("/api/debug/users", async (req, res) => {
  try {
    const User = require("./models/User");
    const users = await User.find().select("_id name email role isHost");
    res.json({ 
      count: users.length, 
      users 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/debug/bookings", async (req, res) => {
  try {
    const Booking = require("./models/Booking");
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("property", "title location price");
    res.json({ 
      count: bookings.length, 
      bookings 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/debug/properties", async (req, res) => {
  try {
    const Property = require("./models/Property");
    const properties = await Property.find().limit(5).populate("host", "name email");
    res.json({ 
      count: await Property.countDocuments(), 
      sample: properties 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server Error"
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(` Server running on port ${PORT}`)
);
