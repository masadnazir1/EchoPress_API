const {
  getSavedArticlesByUserId,
  removeSavedArticle,
  saveArticle,
} = require("../models/SavedArticles");

// GET /api/saved-articles/:userId?page=1&limit=10
const getSavedArticlesController = async (req, res) => {
  const { userId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const articles = await getSavedArticlesByUserId(userId, limit, offset);
    return res.status(200).json({
      page,
      limit,
      total: articles.length,
      articles,
    });
  } catch (err) {
    console.error("Get Saved Articles Error:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// DELETE /api/saved-articles/:userId/:articleId
const deleteSavedArticleController = async (req, res) => {
  const { userId, articleId } = req.params;
  console.log("userId, articleId", userId, articleId);

  try {
    await removeSavedArticle(userId, articleId);
    return res
      .status(200)
      .json({ message: "Saved article removed successfully" });
  } catch (err) {
    console.error("Delete Saved Article Error:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// POST /api/saved-articles/:userId/:articleId
const saveArticleController = async (req, res) => {
  const { userId, articleId } = req.params;

  try {
    const saved = await saveArticle(userId, articleId);
    return res.status(201).json({
      message: "Article saved successfully",
      saved,
    });
  } catch (err) {
    console.error("Save Article Error:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getSavedArticlesController,
  deleteSavedArticleController,
  saveArticleController,
};
