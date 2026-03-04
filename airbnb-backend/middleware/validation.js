// Validation middleware for user inputs

// Validate register input
const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  
  if (name.trim().length < 2) {
    return res.status(400).json({ message: "Name must be at least 2 characters" });
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }
  
  next();
};

// Validate login input
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }
  
  next();
};

// Validate property creation
const validateProperty = (req, res, next) => {
  const { title, location, price, description, images } = req.body;
  
  if (!title || !location || !price || !description) {
    return res.status(400).json({ message: "Title, location, price, and description are required" });
  }
  
  if (title.trim().length < 5) {
    return res.status(400).json({ message: "Title must be at least 5 characters" });
  }
  
  if (isNaN(price) || price <= 0) {
    return res.status(400).json({ message: "Price must be a positive number" });
  }
  
  if (description.trim().length < 10) {
    return res.status(400).json({ message: "Description must be at least 10 characters" });
  }
  
  next();
};

// Validate booking creation
const validateBooking = (req, res, next) => {
  const { property, fromDate, toDate, guests } = req.body;
  
  if (!property || !fromDate || !toDate || guests == null) {
    return res.status(400).json({ message: "Property, fromDate, toDate and guests are required" });
  }
  
  const guestCount = Number(guests);
  if (isNaN(guestCount) || guestCount < 1) {
    return res.status(400).json({ message: "Guests must be a positive number" });
  }

  const from = new Date(fromDate);
  const to = new Date(toDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (from < today) {
    return res.status(400).json({ message: "Check-in date cannot be in the past" });
  }
  
  if (to <= from) {
    return res.status(400).json({ message: "Check-out date must be after check-in date" });
  }
  
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateProperty,
  validateBooking
};
