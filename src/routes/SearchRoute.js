const express = require("express");
const router = express.Router();
const {
  searchArticlesController,
} = require("../controllers/SearchArticlesController");

console.log("Req received");
router.get("/", searchArticlesController);

module.exports = router;
