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
    const { search, category, minPrice, maxPrice, maxGuests, page = 1 } = req.query;
    const limit = parseInt(req.query.limit) || 24; // Items per page
    const skip = (page - 1) * limit;

    let filter = {};

    console.log("Query params:", { search, category, minPrice, maxPrice, maxGuests, page, limit });

    const conditions = [];

    // Search filter (title, listing_title, name, location, breadcrumbs, description)
    if (search && search.trim()) {
      const s = search.trim();
      conditions.push({
        $or: [
          { title: { $regex: s, $options: "i" } },
          { listing_title: { $regex: s, $options: "i" } },
          { name: { $regex: s, $options: "i" } },
          { location: { $regex: s, $options: "i" } },
          { breadcrumbs: { $regex: s, $options: "i" } },
          { description: { $regex: s, $options: "i" } }
        ]
      });
    }

    // Category filter mapping
    if (category && category !== "all") {
      let categoryPattern;
      switch (category.toLowerCase()) {
        case "beachfront":
          categoryPattern = "beach|waterfront|ocean|coast|shore";
          break;
        case "pools":
          categoryPattern = "pool|swim";
          break;
        case "tropical":
          categoryPattern = "tropical|bali|island|palm";
          break;
        case "cabins":
          categoryPattern = "cabin|wood|chalet|nature|treehouse";
          break;
        case "mansions":
          categoryPattern = "mansion|estate|luxury|villa";
          break;
        case "trending":
          categoryPattern = "view|private|oasis|retreat";
          break;
        case "countryside":
          categoryPattern = "country|hill|ranch|farm|valley|creek";
          break;
        case "tiny":
          categoryPattern = "tiny|studio|cottage|compact";
          break;
        case "historical":
          categoryPattern = "historic|castle|heritage|vintage";
          break;
        case "camping":
          categoryPattern = "camp|glamp|tent|yurt";
          break;
        case "arctic":
          categoryPattern = "arctic|snow|ski|winter";
          break;
        case "luxe":
          categoryPattern = "luxe|luxury|penthouse|resort";
          break;
        case "design":
          categoryPattern = "design|architect|modern|loft";
          break;
        default:
          categoryPattern = category;
      }

      conditions.push({
        $or: [
          { title: { $regex: categoryPattern, $options: "i" } },
          { listing_title: { $regex: categoryPattern, $options: "i" } },
          { name: { $regex: categoryPattern, $options: "i" } },
          { location: { $regex: categoryPattern, $options: "i" } },
          { breadcrumbs: { $regex: categoryPattern, $options: "i" } },
          { description: { $regex: categoryPattern, $options: "i" } }
        ]
      });
    }

    // Price filter
    if (minPrice || maxPrice) {
      const priceCondition = {};
      if (minPrice && !isNaN(minPrice)) {
        priceCondition.$gte = Number(minPrice);
      }
      if (maxPrice && !isNaN(maxPrice)) {
        priceCondition.$lte = Number(maxPrice);
      }
      conditions.push({ price: priceCondition });
    }

    // Guest filter
    if (maxGuests && !isNaN(maxGuests)) {
      conditions.push({ maxGuests: { $gte: Number(maxGuests) } });
    }

    if (conditions.length === 1) {
      filter = conditions[0];
    } else if (conditions.length > 1) {
      filter = { $and: conditions };
    }

    console.log("Filter object:", JSON.stringify(filter));

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
    const propertyData = { ...req.body, host: req.user.id };
    const property = await Property.create(propertyData);
    res.status(201).json(property);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};