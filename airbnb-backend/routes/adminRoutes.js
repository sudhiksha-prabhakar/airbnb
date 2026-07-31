const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const { getAdminStats, getAllUsers, getAllBookings } = require("../controllers/adminController");

router.use(protect, adminOnly);

router.get("/stats", getAdminStats);
router.get("/users", getAllUsers);
router.get("/bookings", getAllBookings);

module.exports = router;
