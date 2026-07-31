const adminOnly = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "host")) {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admin authorization required." });
  }
};

module.exports = adminOnly;
