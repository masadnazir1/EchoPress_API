// src/routes/articleRoutes.js
const express = require("express");
const Router = express.Router();
const multer = require("multer");
const upload = multer(); // stores file in memory

const {
  createArticleController,
  getArticleByIdController,
  getAllArticlesController,
  updateArticleController,
  deleteArticleController,
  getAllArticlesByCategory,
} = require("../controllers/articleController");

// CREATE an article (with image upload)
Router.post("/create", upload.single("cover_image"), createArticleController);

// GET all articles (optional query: ?published=true)
Router.get("/all", getAllArticlesController);

// ✅ Place this before `/:id`
Router.get("/category", getAllArticlesByCategory);

// GET an article by ID
Router.get("/:id", getArticleByIdController);

// UPDATE an article by ID
Router.put("/:id", updateArticleController);

// DELETE an article by ID
Router.delete("/:id", deleteArticleController);

module.exports = Router;
