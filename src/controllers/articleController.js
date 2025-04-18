// src/controllers/articleController.js
const {
  createArticle,
  getArticleById,
  getAllArticles,
  updateArticle,
  deleteArticle,
} = require("../models/articles");

const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

// Save image helper
const saveImage = (file) => {
  const ext = path.extname(file.originalname);
  const filename = `${uuidv4()}${ext}`;
  const uploadDir = path.join(__dirname, "../../uploads/article");

  // Ensure the directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const uploadPath = path.join(uploadDir, filename);
  fs.writeFileSync(uploadPath, file.buffer);

  // Return relative path for DB
  return `/uploads/article/${filename}`;
};

// Create an article
const createArticleController = async (req, res) => {
  const {
    title,
    slug,
    author_id,
    published_at,
    is_published,
    tags,
    markdown_content,
    summary,
  } = req.body;

  if (!title || !slug || !author_id || !markdown_content) {
    return res
      .status(400)
      .json({ error: "Title, slug, author ID, and content are required" });
  }

  try {
    let cover_image_url = null;

    if (req.file) {
      cover_image_url = saveImage(req.file);
    }

    const article = await createArticle({
      title,
      slug,
      author_id,
      published_at,
      is_published,
      tags,
      markdown_content,
      summary,
      cover_image_url,
    });

    return res
      .status(201)
      .json({ message: "Article created successfully", article });
  } catch (err) {
    console.error("Create Article Error:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Get article by ID
const getArticleByIdController = async (req, res) => {
  const { id } = req.params;

  try {
    const article = await getArticleById(id);

    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    return res.status(200).json(article);
  } catch (err) {
    console.error("Get Article Error:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Get all articles
const getAllArticlesController = async (req, res) => {
  const onlyPublished = req.query.published === "true";
  const page = parseInt(req.query.page) || 1; // default page = 1
  const limit = parseInt(req.query.limit) || 10; // default limit = 10
  const offset = (page - 1) * limit;

  try {
    const articles = await getAllArticles({ onlyPublished, limit, offset });
    return res.status(200).json({
      page,
      limit,
      articles,
    });
  } catch (err) {
    console.error("Get All Articles Error:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Update article
const updateArticleController = async (req, res) => {
  const { id } = req.params;
  const updatedFields = req.body;

  try {
    await updateArticle(id, updatedFields);
    return res.status(200).json({ message: "Article updated successfully" });
  } catch (err) {
    console.error("Update Article Error:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Delete article
const deleteArticleController = async (req, res) => {
  const { id } = req.params;

  try {
    await deleteArticle(id);
    return res.status(200).json({ message: "Article deleted successfully" });
  } catch (err) {
    console.error("Delete Article Error:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createArticleController,
  getArticleByIdController,
  getAllArticlesController,
  updateArticleController,
  deleteArticleController,
};
