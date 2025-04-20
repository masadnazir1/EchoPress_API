const db = require("../../config/db");

// Save an article
const saveArticle = async (userId, articleId) => {
  try {
    const result = await db.one(
      `INSERT INTO saved_articles (user_id, article_id, saved_at)
       VALUES ($1, $2, NOW())
       RETURNING *`,
      [userId, articleId]
    );
    return result;
  } catch (err) {
    throw new Error("Error saving article");
  }
};

// Get saved articles by user with pagination
const getSavedArticlesByUserId = async (userId, limit = 10, offset = 0) => {
  try {
    const articles = await db.any(
      `
      SELECT a.*
      FROM saved_articles sa
      JOIN articles a ON sa.article_id = a.id
      WHERE sa.user_id = $1
      ORDER BY sa.saved_at DESC
      LIMIT $2 OFFSET $3
      `,
      [userId, limit, offset]
    );
    return articles;
  } catch (err) {
    throw new Error("Error fetching saved articles");
  }
};

// Remove a saved article
const removeSavedArticle = async (userId, articleId) => {
  console.log("userId, articleId", userId, articleId);
  try {
    await db.none(
      `DELETE FROM saved_articles
       WHERE user_id = $1 AND article_id = $2`,
      [userId, articleId]
    );
  } catch (err) {
    throw new Error("Error removing saved article");
  }
};

module.exports = {
  saveArticle,
  getSavedArticlesByUserId,
  removeSavedArticle,
};
