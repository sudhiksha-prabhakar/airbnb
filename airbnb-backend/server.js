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
  console.log("🔎 Connected DB name:", mongoose.connection.db.databaseName);

  const collections = await mongoose.connection.db
    .listCollections()
    .toArray();

  console.log(
    "📂 Collections in this DB:",
    collections.map((c) => c.name)
  );
});

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/properties", require("./routes/propertyRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));

// Health check
app.get("/", (req, res) => {
  res.send("Airbnb backend running 🚀");
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
  console.log(`✅ Server running on port ${PORT}`)
);