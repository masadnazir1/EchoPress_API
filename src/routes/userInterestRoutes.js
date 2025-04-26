const express = require("express");
const router = express.Router();

const {
  trackUserInterestController,
  getUserTopInterestsController,
  getRecommendedArticlesController,
} = require("../controllers/userInterestController");

// Track an interaction (e.g. view, save) with an article
router.post("/track", trackUserInterestController);

// Get user's top interest categories
router.get("/interests/:user_id", getUserTopInterestsController);

// Get recommended articles for the user
router.get("/recommend/:user_id", getRecommendedArticlesController);

module.exports = router;
