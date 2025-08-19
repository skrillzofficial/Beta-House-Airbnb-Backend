const router = require("express").Router();
const {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
} = require("../controllers/user.property");

// Public routes
router.get("/properties", getAllProperties);
router.get("/properties/:id", getPropertyById);

// Protected routes (for admin/managers)
router.post("/properties", createProperty);
router.patch("/properties/:id", updateProperty);
router.delete("/properties/:id", deleteProperty);

module.exports = router;
