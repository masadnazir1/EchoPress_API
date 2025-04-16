const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const sliderModel = require("../models/sliderModel");

// Helper: save image to /upload with unique name
// Save image to /uploads/Sliders/ with unique name
const saveImage = (file) => {
  const ext = path.extname(file.originalname);
  const filename = `${uuidv4()}${ext}`;
  const uploadDir = path.join(__dirname, "../../uploads/Sliders");

  // Ensure the directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const uploadPath = path.join(uploadDir, filename);
  fs.writeFileSync(uploadPath, file.buffer);

  // Return URL or relative path for database
  return `/uploads/Sliders/${filename}`;
};

// POST /api/sliders
const createSlider = async (req, res) => {
  try {
    const { category, title, author } = req.body;
    if (!req.file)
      return res.status(400).json({ error: "Image file is required" });

    const imageUrl = saveImage(req.file);
    const id = await sliderModel.createSlider(
      category,
      title,
      imageUrl,
      author
    );
    res.status(201).json({ id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/sliders
const getAllSliders = async (req, res) => {
  try {
    const sliders = await sliderModel.getAllSliders();
    res.json(sliders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/sliders/:id
const getSliderById = async (req, res) => {
  try {
    const slider = await sliderModel.getSliderById(req.params.id);
    if (!slider) return res.status(404).json({ error: "Slider not found" });
    res.json(slider);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/sliders/:id
const updateSlider = async (req, res) => {
  try {
    const updatedFields = { ...req.body };

    if (req.file) {
      const imageUrl = saveImage(req.file);
      updatedFields.image_url = imageUrl;
    }

    await sliderModel.updateSlider(req.params.id, updatedFields);
    res.json({ message: "Slider updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/sliders/:id
const deleteSlider = async (req, res) => {
  try {
    await sliderModel.deleteSlider(req.params.id);
    res.json({ message: "Slider deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createSlider,
  getAllSliders,
  getSliderById,
  updateSlider,
  deleteSlider,
};
