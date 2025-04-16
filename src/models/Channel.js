const db = require('../../config/db'); // Adjust the path to your db config

// Create a new channel
const createChannel = async (user_id, name, description, logo_url, status = 'pending') => {
  try {
    const result = await db.one(
      'INSERT INTO channels(user_id, name, description, logo_url, status) VALUES($1, $2, $3, $4, $5) RETURNING id',
      [user_id, name, description, logo_url, status]
    );
    return result.id;
  } catch (err) {
    throw new Error('Error creating channel');
  }
};

// Get channel by ID
const getChannelById = async (id) => {
  try {
    const channel = await db.oneOrNone('SELECT * FROM channels WHERE id = $1', [id]);
    return channel;
  } catch (err) {
    throw new Error('Channel not found');
  }
};

// Update a channel
const updateChannel = async (id, updatedFields) => {
  const setFields = Object.keys(updatedFields)
    .map((key, index) => `${key} = $${index + 2}`)
    .join(', ');
  const values = [id, ...Object.values(updatedFields)];
  try {
    await db.none(`UPDATE channels SET ${setFields} WHERE id = $1`, values);
  } catch (err) {
    throw new Error('Error updating channel');
  }
};

// Delete a channel
const deleteChannel = async (id) => {
  try {
    await db.none('DELETE FROM channels WHERE id = $1', [id]);
  } catch (err) {
    throw new Error('Error deleting channel');
  }
};

module.exports = { createChannel, getChannelById, updateChannel, deleteChannel };
