const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false 
    },
    listing_title: { type: String },
    name: { type: String },
    title: { type: String },
    location: { type: String },
    price: { type: Number, default: 3000 },
    images: { type: mongoose.Schema.Types.Mixed },
    image: { type: String },
    description: { type: String },
    maxGuests: { type: Number },
    breadcrumbs: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);