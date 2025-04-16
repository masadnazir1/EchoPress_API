const db = require('../../config/db'); // Adjust the path to your db config

// Create a new comment
const createComment = async (post_id, user_id, content) => {
  try {
    const result = await db.one(
      'INSERT INTO comments(post_id, user_id, content) VALUES($1, $2, $3) RETURNING id',
      [post_id, user_id, content]
    );
    return result.id;
  } catch (err) {
    throw new Error('Error creating comment');
  }
};

// Get comments for a post
const getCommentsByPostId = async (post_id) => {
  try {
    const comments = await db.any('SELECT * FROM comments WHERE post_id = $1', [post_id]);
    return comments;
  } catch (err) {
    throw new Error('Error fetching comments');
  }
};

// Delete a comment
const deleteComment = async (id) => {
  try {
    await db.none('DELETE FROM comments WHERE id = $1', [id]);
  } catch (err) {
    throw new Error('Error deleting comment');
  }
};

module.exports = { createComment, getCommentsByPostId, deleteComment };
