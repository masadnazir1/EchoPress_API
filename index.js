const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const db = require("./config/db"); // Optional: test pg connection
const path = require("path");

// Routes (to be implemented)
const authRoute = require("./src/routes/auth");
const sliderRoute = require("./src/routes/SliderRoute");

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
// Make uploads publicly accessible
// ✅ CORRECT
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Test route
app.get("/", (req, res) => {
  res.send("📣 EchoPress API is up and running!");
});

// Attach your routes
app.use("/api/auth", authRoute);
app.use("/api/sliders", sliderRoute);

// Start server
app.listen(port, () => {
  db.connect();
  console.log(`🚀 Server running on http://localhost:${port}`);
});
