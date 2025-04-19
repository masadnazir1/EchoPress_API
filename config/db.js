const e = require("express");

// src/config/db.js
const pgp = require("pg-promise")();
require("dotenv").config();

const db = pgp({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
});

if (db) {
  console.log("📦 Database connection established successfully!");
} else {
  console.error("❌ Failed to connect to the database.");
}
module.exports = db;
