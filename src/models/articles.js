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
    categories_id,
  } = article;

  try {
    const result = await db.one(
      `INSERT INTO articles 
      (title, slug, author_id, published_at, is_published, tags, markdown_content, summary, cover_image_url,categories_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9,$10)
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
        categories_id,
      ]
    );
    return result;
  } catch (err) {
    throw new Error(`Error creating article: ${err.message}`);
  }
};

// Get an article by ID
const getArticleById = async (id) => {
  //
  console.log("", id);
  //
  try {
    const article = await db.oneOrNone("SELECT * FROM articles WHERE id = $1", [
      id,
    ]);
    return article;
  } catch (err) {
    throw new Error("Article not found");
  }
};

// Get an article by ID
const getArticleByCategory = async (
  onlyPublished,
  limit,
  offset,
  categoryId
) => {
  let query = "SELECT * FROM articles WHERE categories_id = $1";
  const values = [categoryId];

  if (onlyPublished) {
    values.push(true);
    query += ` AND is_published = $${values.length}`;
  }

  console.log(values);
  values.push(limit); // limit
  values.push(offset); // offset

  query += ` ORDER BY published_at DESC LIMIT $${values.length - 1} OFFSET $${
    values.length
  }`;

  try {
    const result = await db.query(query, values);

    return result;
  } catch (err) {
    throw new Error("Error fetching articles by category: " + err.message);
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
//

// Search articles by keyword
const searchArticles = async ({ keyword, onlyPublished, limit, offset }) => {
  let query = "SELECT * FROM articles WHERE";
  const values = [];
  const searchConditions = [];

  if (keyword) {
    values.push(`%${keyword}%`);
    values.push(`%${keyword}%`);
    values.push(`%${keyword}%`);
    values.push(`%${keyword}%`);
    //
    searchConditions.push(
      `(title ILIKE $${values.length - 3} OR 
        ARRAY_TO_STRING(tags, ',') ILIKE $${values.length - 2} OR 
        summary ILIKE $${values.length - 1} OR 
        markdown_content ILIKE $${values.length})`
    );
  }

  if (onlyPublished) {
    values.push(true);
    searchConditions.push(`is_published = $${values.length}`);
  }

  query += ` ${searchConditions.join(" AND ")}`;
  values.push(limit);
  values.push(offset);

  query += ` ORDER BY published_at DESC LIMIT $${values.length - 1} OFFSET $${
    values.length
  }`;

  try {
    const result = await db.query(query, values);
    return result;
  } catch (err) {
    throw new Error("Error searching articles: " + err.message);
  }
};

//

module.exports = {
  createArticle,
  getArticleById,
  getAllArticles,
  updateArticle,
  deleteArticle,
  getArticleByCategory,
  searchArticles,
};
