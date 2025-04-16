const pool = require("../../config/db"); // make sure this points to your pg pool

const CategoryModel = {
  async create({ id, name, slug }) {
    const query = `
      INSERT INTO categories (id, name, slug)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [id, name, slug];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async getAll() {
    const { rows } = await pool.query("SELECT * FROM categories;");
    return rows;
  },

  async getById(id) {
    const query = `SELECT * FROM categories WHERE id = $1;`;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  async update(id, { name, slug }) {
    const query = `
      UPDATE categories
      SET name = $1, slug = $2
      WHERE id = $3
      RETURNING *;
    `;
    const values = [name, slug, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async delete(id) {
    const query = `DELETE FROM categories WHERE id = $1 RETURNING *;`;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
};

module.exports = CategoryModel;
