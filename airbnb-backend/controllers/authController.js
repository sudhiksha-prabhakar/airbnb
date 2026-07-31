const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId.toString(), role: role || "user" }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// @desc   Register user
// @route  POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check existing user
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user (password hashing handled in model)
    const user = await User.create({ name, email, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isHost: user.isHost,
      hostDescription: user.hostDescription,
      profilePhoto: user.profilePhoto,
      token: generateToken(user._id),
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Login user
// @route  POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Explicitly select password
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isHost: user.isHost,
      hostDescription: user.hostDescription,
      profilePhoto: user.profilePhoto,
      token: generateToken(user._id, user.role),
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Become a host
// @route  PUT /api/auth/become-host
exports.becomeHost = async (req, res) => {
  try {
    const { hostDescription } = req.body;
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ message: "User ID not found in token" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { 
        isHost: true, 
        role: "host",
        hostDescription: hostDescription || ""
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isHost: user.isHost,
      hostDescription: user.hostDescription,
      profilePhoto: user.profilePhoto,
      message: "You are now a host!"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get current user
// @route  GET /api/auth/me
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isHost: user.isHost,
      hostDescription: user.hostDescription
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};