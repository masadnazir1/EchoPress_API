const pool = require("../../config/db");

const createUserInterest = async ({
  user_id,
  article_id,
  category,
  action,
}) => {
  const query = `
    INSERT INTO user_interests (user_id, article_id, category, action)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [user_id, article_id, category, action];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

const getUserInterestScores = async (user_id) => {
  const query = `
    SELECT category, COUNT(*) AS score
    FROM user_interests
    WHERE user_id = $1
    GROUP BY category
    ORDER BY score DESC
    LIMIT 5;
  `;
  const { rows } = await pool.query(query, [user_id]);
  return rows;
};

const getRecommendedArticlesByInterest = async (user_id, limit = 10) => {
  const topCategoriesQuery = `
    SELECT category
    FROM user_interests
    WHERE user_id = $1
    GROUP BY category
    ORDER BY COUNT(*) DESC
    LIMIT 5;
  `;
  const { rows: categories } = await pool.query(topCategoriesQuery, [user_id]);

  const categoryList = categories.map((row) => row.category);

  const articleQuery = `
    SELECT *
    FROM articles
    WHERE category = ANY($1)
    AND is_published = true
    ORDER BY published_at DESC
    LIMIT $2;
  `;

  const { rows: articles } = await pool.query(articleQuery, [
    categoryList,
    limit,
  ]);
  return articles;
};

module.exports = {
  createUserInterest,
  getUserInterestScores,
  getRecommendedArticlesByInterest,
};
