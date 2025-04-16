const express = require("express");
const router = express.Router();
const multer = require("multer");

// In-memory storage since you're saving manually in controller
const storage = multer.memoryStorage();
const upload = multer({ storage });

const {
  createSlider,
  getAllSliders,
  getSliderById,
  updateSlider,
  deleteSlider,
} = require("../controllers/sliderController");

// Create a new slider with image upload
router.post("/create", upload.single("image"), createSlider);

// Get all sliders
router.get("/", getAllSliders);

// Get a slider by ID
router.get("/:id", getSliderById);

// Update a slider with image (optional)
router.put("/:id", upload.single("image"), updateSlider);

// Delete a slider
router.delete("/:id", deleteSlider);

module.exports = router;
