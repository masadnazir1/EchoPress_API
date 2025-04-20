const express = require("express");
const router = express.Router();

const {
  createCategoryController,
  getCategoryByIdController,
  getAllCategoriesController,
  updateCategoryController,
  deleteCategoryController,
} = require("../controllers/categoryController");

// POST /api/categories - Create a new category
router.post("/", createCategoryController);

// GET /api/categories - Get all categories
router.get("/all", getAllCategoriesController);

// GET /api/categories/:id - Get category by ID
router.get("/:id", getCategoryByIdController);

// PUT /api/categories/:id - Update a category
router.put("/:id", updateCategoryController);

// DELETE /api/categories/:id - Delete a category
router.delete("/:id", deleteCategoryController);

module.exports = router;
