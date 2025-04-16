// src/models/User.js
const db = require('../../config/db'); // Adjust the path to your db config

// Create a new user
const createUser = async (user) => {
  const {newUuid, name, email, password, role = 'user' } = user;
  console.log('Creating user:',newUuid, name, email, password, role);
  try {
    const result = await db.one(
      'INSERT INTO users(id,name, email, password, role) VALUES($1, $2, $3, $4,$5) RETURNING *',
      [newUuid,name, email, password, role]
    );
    return result;
  } catch (err) {
    // throw new Error('Error creating user');
    throw new Error(`Error creating user: ${err.message}`); // Include the error message
  }
};

// Get a user by ID
const getUserById = async (id) => {
  try {
    const user = await db.oneOrNone('SELECT * FROM users WHERE id = $1', [id]);
    return user;
  } catch (err) {
    throw new Error('User not found');
  }
};

// Get a user by email
const getUserByEmail = async (email) => {
  try {
    const user = await db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);
    return user;
  } catch (err) {
    throw new Error('User not found');
  }
};

// Update a user
const updateUser = async (id, updatedFields) => {
  const setFields = Object.keys(updatedFields)
    .map((key, index) => `${key} = $${index + 2}`)
    .join(', ');
  const values = [id, ...Object.values(updatedFields)];
  try {
    const result = await db.none(`UPDATE users SET ${setFields} WHERE id = $1`, values);
    return result;
  } catch (err) {
    throw new Error('Error updating user');
  }
};

// Delete a user
const deleteUser = async (id) => {
  try {
    await db.none('DELETE FROM users WHERE id = $1', [id]);
  } catch (err) {
    throw new Error('Error deleting user');
  }
};

module.exports = { createUser, getUserById, getUserByEmail, updateUser, deleteUser };
