const {
  createCategory,
  getCategoryById,
  getAllCategories,
  updateCategory,
  deleteCategory,
} = require("../models/CategoriesModel");

// Create a new category
const createCategoryController = async (req, res) => {
  const { name, slug, categories_icon } = req.body;

  if (!name || !slug) {
    return res.status(400).json({ error: "Name and slug are required" });
  }

  try {
    const category = await createCategory({ name, slug, categories_icon });
    return res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (err) {
    console.error("Create Category Error:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Get category by ID
const getCategoryByIdController = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await getCategoryById(id);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    return res.status(200).json(category);
  } catch (err) {
    console.error("Get Category Error:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Get all categories
const getAllCategoriesController = async (_req, res) => {
  try {
    const categories = await getAllCategories();
    return res.status(200).json(categories);
  } catch (err) {
    console.error("Get All Categories Error:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Update category
const updateCategoryController = async (req, res) => {
  const { id } = req.params;
  const updatedFields = req.body;

  try {
    await updateCategory(id, updatedFields);
    return res.status(200).json({ message: "Category updated successfully" });
  } catch (err) {
    console.error("Update Category Error:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Delete category
const deleteCategoryController = async (req, res) => {
  const { id } = req.params;

  try {
    await deleteCategory(id);
    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error("Delete Category Error:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createCategoryController,
  getCategoryByIdController,
  getAllCategoriesController,
  updateCategoryController,
  deleteCategoryController,
};
