const User = require("../models/User");

const adminOnly = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const userDoc = await User.findById(req.user.id);
    if (userDoc && (userDoc.role === "admin" || userDoc.role === "host")) {
      req.userDoc = userDoc;
      next();
    } else {
      res.status(403).json({ message: "Access denied. Admin authorization required." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = adminOnly;
