const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const { validateBooking } = require("../middleware/validation");
const {
  createBooking,
  getUserBookings,
  cancelBooking
} = require("../controllers/bookingController");

// Create booking (logged-in users)
router.post("/", protect, validateBooking, createBooking);

// Get logged-in user's bookings
router.get("/my", protect, getUserBookings);

// Cancel a booking
router.put("/:id/cancel", protect, cancelBooking);

module.exports = router;