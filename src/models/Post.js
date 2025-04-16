const db = require('../../config/db'); // Adjust the path to your db config

// Create a new post
const createPost = async (channel_id, title, slug, content, category_id, image_url, status = 'draft') => {
  try {
    const result = await db.one(
      'INSERT INTO posts(channel_id, title, slug, content, category_id, image_url, status) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [channel_id, title, slug, content, category_id, image_url, status]
    );
    return result.id;
  } catch (err) {
    throw new Error('Error creating post');
  }
};

// Get a post by ID
const getPostById = async (id) => {
  try {
    const post = await db.oneOrNone('SELECT * FROM posts WHERE id = $1', [id]);
    return post;
  } catch (err) {
    throw new Error('Post not found');
  }
};

// Update a post
const updatePost = async (id, updatedFields) => {
  const setFields = Object.keys(updatedFields)
    .map((key, index) => `${key} = $${index + 2}`)
    .join(', ');
  const values = [id, ...Object.values(updatedFields)];
  try {
    await db.none(`UPDATE posts SET ${setFields} WHERE id = $1`, values);
  } catch (err) {
    throw new Error('Error updating post');
  }
};

// Delete a post
const deletePost = async (id) => {
  try {
    await db.none('DELETE FROM posts WHERE id = $1', [id]);
  } catch (err) {
    throw new Error('Error deleting post');
  }
};

module.exports = { createPost, getPostById, updatePost, deletePost };
