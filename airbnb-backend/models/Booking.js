const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true
    },
    fromDate: {
      type: Date,
      required: true
    },
    toDate: {
      type: Date,
      required: true
    },
    guests: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ["confirmed", "cancelled", "completed"],
      default: "confirmed"
    }
  },
  { timestamps: true }
);

// Validate date range
bookingSchema.pre("save", function (next) {
  if (this.toDate <= this.fromDate) {
    return next(new Error("toDate must be after fromDate"));
  }
  next();
});

module.exports = mongoose.model("Booking", bookingSchema);