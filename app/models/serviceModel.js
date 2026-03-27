const db = require('../../config/db');

class ServiceModel {
  static async create(service) {
    const { provider_id, title, description = null, price, category, image = null } = service;
    const [result] = await db.execute(
      'INSERT INTO services (provider_id, title, description, price, category, image) VALUES (?, ?, ?, ?, ?, ?)',
      [provider_id, title, description, price, category, image]
    );
    return result.insertId;
  }

  static async findAll(filters, page = 1, limit = 10) {
    let query = 'SELECT * FROM services WHERE 1=1';
    const params = [];

    if (filters.category) {
      query += ' AND category = ?';
      params.push(filters.category);
    }

    if (filters.minPrice) {
      query += ' AND price >= ?';
      params.push(filters.minPrice);
    }

    if (filters.maxPrice) {
      query += ' AND price <= ?';
      params.push(filters.maxPrice);
    }

    if (filters.providerId) {
      query += ' AND provider_id = ?';
      params.push(filters.providerId);
    }

    if (filters.search) {
      query += ' AND (title LIKE ? OR description LIKE ?)';
      params.push(`%${filters.search}%`);
      params.push(`%${filters.search}%`);
    }

    const parsedLimit = parseInt(limit, 10) || 10;
    const parsedPage = parseInt(page, 10) || 1;
    const offset = (parsedPage - 1) * parsedLimit;

    query += ` ORDER BY created_at DESC LIMIT ${parsedLimit} OFFSET ${offset}`;

    const [rows] = await db.execute(query, params);
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM services WHERE id = ?', [id]);
    return rows[0];
  }

  static async update(id, service) {
    const { title, description = null, price, category, image = null } = service;
    const [result] = await db.execute(
      'UPDATE services SET title = ?, description = ?, price = ?, category = ?, image = ? WHERE id = ?',
      [title, description, price, category, image, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await db.execute('DELETE FROM services WHERE id = ?', [id]);
    return result.affectedRows;
  }
}

module.exports = ServiceModel;
