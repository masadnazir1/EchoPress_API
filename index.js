const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const db = require("./config/db"); // Optional: test pg connection
const path = require("path");

// Routes (to be implemented)
const authRoute = require("./src/routes/auth");
const sliderRoute = require("./src/routes/SliderRoute");
const ArticleRoutes = require("./src/routes/articleRoute");
const savedArticleRoutes = require("./src/routes/savedArticlesRoute");
const categoryRoute = require("./src/routes/categoryRoute");
const userInterest = require("./src/routes/userInterestRoutes");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*" || "https://blogbook.galaxydev.pk/*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//

// uploads publicly accessible
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Test route
app.get("/", (req, res) => {
  res.send("📣 EchoPress API is up and running!");
});

// Attach your routes
app.use("/api/auth", authRoute);
app.use("/api/sliders", sliderRoute);
app.use("/api/articles", ArticleRoutes);
app.use("/api/savedarticles", savedArticleRoutes);
app.use("/api/categories", categoryRoute);
app.use("/api//userInterest", userInterest);

// Start server
app.listen(port, "0.0.0.0", () => {
  db.connect();
  console.log(`🚀 Server running on http://localhost:${port}`);
});
