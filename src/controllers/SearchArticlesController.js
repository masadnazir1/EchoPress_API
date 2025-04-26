// src/controllers/articleController.js
const { searchArticles } = require("../models/articles");

// Search articles controller
const searchArticlesController = async (req, res) => {
  const keyword = req.query.q || ""; // search keyword
  const onlyPublished = req.query.published === "true"; // optional
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  if (!keyword.trim()) {
    return res.status(400).json({ error: "Search keyword (q) is required" });
  }

  try {
    const articles = await searchArticles({
      keyword,
      onlyPublished,
      limit,
      offset,
    });

    return res.status(200).json({
      page,
      limit,
      articles,
    });
  } catch (err) {
    console.error("Search Articles Error:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  searchArticlesController,
};
