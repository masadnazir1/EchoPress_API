// src/models/Article.js
const db = require("../../config/db"); // Adjust path as needed

// Create a new article
const createArticle = async (article) => {
  const {
    title,
    slug,
    author_id,
    published_at = null,
    is_published = false,
    tags = [],
    markdown_content,
    summary = null,
    cover_image_url = null,
  } = article;

  try {
    const result = await db.one(
      `INSERT INTO articles 
      (title, slug, author_id, published_at, is_published, tags, markdown_content, summary, cover_image_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        title,
        slug,
        author_id,
        published_at,
        is_published,
        tags,
        markdown_content,
        summary,
        cover_image_url,
      ]
    );
    return result;
  } catch (err) {
    throw new Error(`Error creating article: ${err.message}`);
  }
};

// Get an article by ID
const getArticleById = async (id) => {
  try {
    const article = await db.oneOrNone("SELECT * FROM articles WHERE id = $1", [
      id,
    ]);
    return article;
  } catch (err) {
    throw new Error("Article not found");
  }
};

// Get all articles (optionally filter published)
// src/models/Article.js

const getAllArticles = async ({ onlyPublished, limit, offset }) => {
  let query = "SELECT * FROM articles";
  const values = [];

  if (onlyPublished) {
    values.push(true);
    query += ` WHERE is_published = $${values.length}`;
  }

  values.push(limit); // limit
  values.push(offset); // offset
  query += ` ORDER BY published_at DESC LIMIT $${values.length - 1} OFFSET $${
    values.length
  }`;

  try {
    const result = await db.query(query, values);

    return result;
  } catch (err) {
    throw new Error("Error fetching articles: " + err.message);
  }
};

// Update an article
const updateArticle = async (id, updatedFields) => {
  const setFields = Object.keys(updatedFields)
    .map((key, index) => `${key} = $${index + 2}`)
    .join(", ");
  const values = [id, ...Object.values(updatedFields)];
  try {
    await db.none(
      `UPDATE articles SET ${setFields}, updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
      values
    );
  } catch (err) {
    throw new Error("Error updating article");
  }
};

// Delete an article
const deleteArticle = async (id) => {
  try {
    await db.none("DELETE FROM articles WHERE id = $1", [id]);
  } catch (err) {
    throw new Error("Error deleting article");
  }
};

module.exports = {
  createArticle,
  getArticleById,
  getAllArticles,
  updateArticle,
  deleteArticle,
};
