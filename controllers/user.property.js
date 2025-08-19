const PROPERTY = require("../models/propertySchema");
const cloudinary = require("cloudinary").v2;

// Create new property
const createProperty = async (req, res) => {
  try {
    const { title, price, location, bedrooms, bathrooms, status, isFeatured } =
      req.body;

    // Validate required fields
    if (!title || !price || !location) {
      return res.status(400).json({
        success: false,
        message: "Title, price, and location are required fields",
      });
    }

    // Validate price is a positive number
    if (isNaN(price) || Number(price) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a valid positive number",
      });
    }

    // Handle image uploads if files are provided
    let imageUrls = [];
    if (req.files && req.files.images) {
      const images = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];

      for (const image of images) {
        try {
          const result = await cloudinary.uploader.upload(image.tempFilePath, {
            folder: "beta-house/properties",
            use_filename: true,
            resource_type: "auto",
          });
          imageUrls.push(result.secure_url);
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError);
          // Continue with other images even if one fails
        }
      }
    }

    // Create the property with simplified schema
    const propertyData = {
      title: title.trim(),
      price: Number(price),
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      location: location.trim(),
      images:
        imageUrls.length > 0
          ? imageUrls
          : [
              "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=60",
            ],
      status: status || "For sale",
      isFeatured: isFeatured === "true" || isFeatured === true,
    };

    // Create the property
    const property = await PROPERTY.create(propertyData);

    res.status(201).json({
      success: true,
      message: "Property created successfully",
      property,
    });
  } catch (error) {
    console.error("Create property error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get all properties
const getAllProperties = async (req, res) => {
  try {
    const properties = await PROPERTY.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get property by ID
const getPropertyById = async (req, res) => {
  try {
    const property = await PROPERTY.findById(req.params.id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    // Increment views (optional)
    property.views = (property.views || 0) + 1;
    await property.save();

    res.status(200).json({
      success: true,
      property,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update property
const updateProperty = async (req, res) => {
  try {
    const property = await PROPERTY.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Property updated successfully",
      property,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete property
const deleteProperty = async (req, res) => {
  try {
    const property = await PROPERTY.findByIdAndDelete(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
};
