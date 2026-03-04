const Booking = require("../models/Booking");
const Property = require("../models/Property");

// @desc    Create booking
// @route   POST /api/bookings
exports.createBooking = async (req, res) => {
  try {
    const { property, fromDate, toDate, guests } = req.body;

    // Check overlapping bookings
    const existingBooking = await Booking.findOne({
      property,
      status: "confirmed",
      $or: [
        {
          fromDate: { $lte: toDate },
          toDate: { $gte: fromDate }
        }
      ]
    });

    if (existingBooking) {
      return res
        .status(400)
        .json({ message: "Property already booked for selected dates" });
    }

    // Fetch property and ensure maxGuests is respected
    const propertyData = await Property.findById(property);
    if (!propertyData) {
      return res.status(404).json({ message: "Property not found" });
    }

    const guestCount = Number(guests || 0);
    if (guestCount < 1) {
      return res.status(400).json({ message: "Guests must be at least 1" });
    }
    if (propertyData.maxGuests && guestCount > propertyData.maxGuests) {
      return res.status(400).json({
        message: `Maximum allowed guests is ${propertyData.maxGuests}`
      });
    }

    // Calculate days
    const days =
      (new Date(toDate) - new Date(fromDate)) / (1000 * 60 * 60 * 24);

    if (days <= 0) {
      return res.status(400).json({ message: "Invalid booking dates" });
    }

    const totalPrice = days * propertyData.price;

    const booking = await Booking.create({
      user: req.user.id,
      property,
      fromDate,
      toDate,
      guests: guestCount,
      totalPrice
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged-in user's bookings
// @route   GET /api/bookings/my
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("property", "title location price images");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel a booking (owner only)
// @route   PUT /api/bookings/:id/cancel
exports.cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    // Only the user who created the booking can cancel
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to cancel this booking" });
    }
    // Only confirmed bookings can be cancelled
    if (booking.status !== "confirmed") {
      return res.status(400).json({ message: "Only confirmed bookings can be cancelled" });
    }
    // Optionally prevent cancelling past bookings
    if (new Date() > new Date(booking.toDate)) {
      return res.status(400).json({ message: "Cannot cancel past bookings" });
    }

    booking.status = "cancelled";
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};