const {
  createUserInterest,
  getUserInterestScores,
  getRecommendedArticlesByInterest,
} = require("../models/userInterestModel");

// Track a user interaction with an article
const trackUserInterestController = async (req, res) => {
  const { user_id, article_id, category, action } = req.body;

  if (!user_id || !article_id || !category || !action) {
    return res.status(400).json({
      error: "user_id, article_id, category, and action are required.",
    });
  }

  try {
    const interest = await createUserInterest({
      user_id,
      article_id,
      category,
      action,
    });
    return res
      .status(201)
      .json({ message: "Interest tracked successfully", interest });
  } catch (err) {
    console.error("Track User Interest Error:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Get top categories a user interacts with
const getUserTopInterestsController = async (req, res) => {
  const { user_id } = req.params;

  if (!user_id) {
    return res.status(400).json({ error: "user_id is required." });
  }

  try {
    const interests = await getUserInterestScores(user_id);
    return res.status(200).json({ interests });
  } catch (err) {
    console.error("Get User Interests Error:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Get recommended articles based on user interest
const getRecommendedArticlesController = async (req, res) => {
  const { user_id } = req.params;
  const limit = parseInt(req.query.limit) || 10;

  if (!user_id) {
    return res.status(400).json({ error: "user_id is required." });
  }

  try {
    const recommended = await getRecommendedArticlesByInterest(user_id, limit);
    return res.status(200).json({ recommended });
  } catch (err) {
    console.error("Get Recommended Articles Error:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  trackUserInterestController,
  getUserTopInterestsController,
  getRecommendedArticlesController,
};
