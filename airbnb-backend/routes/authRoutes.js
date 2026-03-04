const express = require("express");
const router = express.Router();
const { register, login, becomeHost, getCurrentUser } = require("../controllers/authController");
const { validateRegister, validateLogin } = require("../middleware/validation");
const protect = require("../middleware/authMiddleware");

// @route   POST /api/auth/register
router.post("/register", validateRegister, register);

// @route   POST /api/auth/login
router.post("/login", validateLogin, login);

// @route   PUT /api/auth/become-host
router.put("/become-host", protect, becomeHost);

// @route   GET /api/auth/me
router.get("/me", protect, getCurrentUser);

module.exports = router;