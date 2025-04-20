const db = require("../../config/db");

// Create a new category
const createCategory = async ({ name, slug, categories_icon }) => {
  console.log("Received the req", name, slug, categories_icon);
  try {
    const result = await db.one(
      `INSERT INTO categories (name, slug, categories_icon)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, slug, categories_icon]
    );
    return result;
  } catch (err) {
    throw new Error("Error creating category: " + err.message);
  }
};

// Get category by ID
const getCategoryById = async (id) => {
  try {
    const category = await db.oneOrNone(
      "SELECT * FROM categories WHERE id = $1",
      [id]
    );
    return category;
  } catch (err) {
    throw new Error("Error fetching category by ID: " + err.message);
  }
};

// Get all categories
const getAllCategories = async () => {
  try {
    const result = await db.any("SELECT * FROM categories ORDER BY name ASC");
    return result;
  } catch (err) {
    throw new Error("Error fetching categories: " + err.message);
  }
};

// Update a category
const updateCategory = async (id, updatedFields) => {
  const setFields = Object.keys(updatedFields)
    .map((key, index) => `${key} = $${index + 2}`)
    .join(", ");
  const values = [id, ...Object.values(updatedFields)];

  try {
    await db.none(`UPDATE categories SET ${setFields} WHERE id = $1`, values);
  } catch (err) {
    throw new Error("Error updating category: " + err.message);
  }
};

// Delete a category
const deleteCategory = async (id) => {
  try {
    await db.none("DELETE FROM categories WHERE id = $1", [id]);
  } catch (err) {
    throw new Error("Error deleting category: " + err.message);
  }
};

module.exports = {
  createCategory,
  getCategoryById,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
