const db = require('../../config/db'); // Adjust the path to your db config

// Create a post view record
const createPostView = async (post_id, user_id) => {
  try {
    const result = await db.one(
      'INSERT INTO post_views(post_id, user_id) VALUES($1, $2) RETURNING id',
      [post_id, user_id]
    );
    return result.id;
  } catch (err) {
    throw new Error('Error creating post view');
  }
};

// Get views for a post
const getPostViewsByPostId = async (post_id) => {
  try {
    const views = await db.any('SELECT * FROM post_views WHERE post_id = $1', [post_id]);
    return views;
  } catch (err) {
    throw new Error('Error fetching post views');
  }
};

module.exports = { createPostView, getPostViewsByPostId };
