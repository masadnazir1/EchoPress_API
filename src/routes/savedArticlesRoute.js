const express = require("express");
const router = express.Router();

const {
  getSavedArticlesController,
  deleteSavedArticleController,
  saveArticleController,
} = require("../controllers/savedArticleController");

// Route to save an article
// POST /api/saved-articles/:userId/:articleId
router.post("/:userId/:articleId", saveArticleController);

// Route to get all saved articles for a user with pagination
// GET /api/saved-articles/:userId?page=1&limit=10
router.get("/:userId", getSavedArticlesController);

// Route to delete a saved article
// DELETE /api/saved-articles/:userId/:articleId
router.delete("/:userId/:articleId", deleteSavedArticleController);

module.exports = router;
