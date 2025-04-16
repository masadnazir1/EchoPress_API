const db = require("../../config/db"); // Adjust path based on your project structure

// Create a new slider
const createSlider = async (
  category,
  title,
  image_url,
  author,
  published_at = new Date()
) => {
  try {
    const result = await db.one(
      "INSERT INTO sliders (category, title, image_url, author, published_at) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [category, title, image_url, author, published_at]
    );
    return result.id;
  } catch (err) {
    throw new Error("Error creating slider");
  }
};

// Get a slider by ID
const getSliderById = async (id) => {
  try {
    const slider = await db.oneOrNone("SELECT * FROM sliders WHERE id = $1", [
      id,
    ]);
    return slider;
  } catch (err) {
    throw new Error("Slider not found");
  }
};

// Get all sliders
const getAllSliders = async () => {
  try {
    const sliders = await db.any(
      "SELECT * FROM sliders ORDER BY published_at DESC"
    );
    return sliders;
  } catch (err) {
    throw new Error("Error fetching sliders");
  }
};

// Update a slider
const updateSlider = async (id, updatedFields) => {
  const setFields = Object.keys(updatedFields)
    .map((key, index) => `${key} = $${index + 2}`)
    .join(", ");
  const values = [id, ...Object.values(updatedFields)];
  try {
    await db.none(`UPDATE sliders SET ${setFields} WHERE id = $1`, values);
  } catch (err) {
    throw new Error("Error updating slider");
  }
};

// Delete a slider
const deleteSlider = async (id) => {
  try {
    await db.none("DELETE FROM sliders WHERE id = $1", [id]);
  } catch (err) {
    throw new Error("Error deleting slider");
  }
};

module.exports = {
  createSlider,
  getSliderById,
  getAllSliders,
  updateSlider,
  deleteSlider,
};
