const Property = require("../models/Property");

// Helper to handle the "images" field which is a stringified array in your JSON
const fixImages = (p) => {
  try {
    if (typeof p.images === "string") {
      return JSON.parse(p.images);
    } else if (Array.isArray(p.images)) {
      return p.images;
    } else if (p.image) {
      return [p.image.replace(/"/g, "")];
    }
  } catch (e) {
    return ["https://via.placeholder.com/400x300?text=No+Image"];
  }
  return [];
};

exports.getAllProperties = async (req, res) => {
  try {
    const { search, minPrice, maxPrice, maxGuests, page = 1 } = req.query;
    const limit = 8; // Items per page
    const skip = (page - 1) * limit;

    let filter = {};

    console.log("Query params:", { search, minPrice, maxPrice, maxGuests, page });

    // Search filter (title or location)
    if (search && search.trim()) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { listing_title: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { breadcrumbs: { $regex: search, $options: "i" } }
      ];
    }

    // Price filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice && !isNaN(minPrice)) {
        filter.price.$gte = Number(minPrice);
      }
      if (maxPrice && !isNaN(maxPrice)) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    // Guest filter
    if (maxGuests && !isNaN(maxGuests)) {
      filter.maxGuests = { $gte: Number(maxGuests) };
    }

    console.log("Filter object:", filter);

    // Get total count for pagination
    const totalCount = await Property.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);

    // Get paginated results
    const properties = await Property.find(filter)
      .limit(limit)
      .skip(skip)
      .lean();

    console.log(`Found ${properties.length} properties (Total: ${totalCount}, Page: ${page}/${totalPages})`);

    const fixedProperties = properties.map((p) => ({
      _id: p._id,
      title: p.listing_title || p.name || p.title || "Untitled Property",
      location: p.location || p.breadcrumbs || "Unknown Location",
      price: p.price || 3000,
      images: fixImages(p),
      description: p.description || "No description available",
      maxGuests: p.maxGuests || 2
    }));

    res.json({
      properties: fixedProperties,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalCount,
        limit
      }
    });
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getPropertyById = async (req, res) => {
  try {
    const p = await Property.findById(req.params.id).lean();
    if (!p) return res.status(404).json({ message: "Property not found" });
    
    res.json({
      _id: p._id,
      title: p.listing_title || p.name || p.title || "Untitled Property",
      location: p.location || p.breadcrumbs || "Unknown Location",
      price: p.price || 3000,
      images: fixImages(p),
      description: p.description || "No description available",
      maxGuests: p.maxGuests || 2
    });
  } catch (error) {
    res.status(400).json({ message: "Invalid property ID" });
  }
};

exports.createProperty = async (req, res) => {
  try {
    const property = await Property.create(req.body);
    res.status(201).json(property);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};