const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const { getAdminStats, getAllUsers, getAllBookings, getAllProperties } = require("../controllers/adminController");

router.use(protect, adminOnly);

router.get("/stats", getAdminStats);
router.get("/users", getAllUsers);
router.get("/bookings", getAllBookings);
router.get("/properties", getAllProperties);

module.exports = router;
