const express = require("express");
const router = express.Router();
const {
  getAllProperties,
  getPropertyById,
  createProperty
} = require("../controllers/propertyController");
const protect = require("../middleware/authMiddleware");
const { validateProperty } = require("../middleware/validation");

router.get("/", getAllProperties);
router.get("/:id", getPropertyById);
router.post("/", protect, validateProperty, createProperty);

module.exports = router;