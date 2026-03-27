const db = require('../../config/db');

class AdminModel {
  static async setBlockStatus(userId, status) {
    await db.execute('UPDATE users SET is_blocked = ? WHERE id = ?', [status, userId]);
  }

  static async setProviderApproval(providerId, status) {
    await db.execute('UPDATE providers SET is_approved = ? WHERE id = ?', [status, providerId]);
  }

  static async getAllUsers(searchTerm = '', page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    let query = 'SELECT id, name, email, role, is_blocked, created_at FROM users';
    const params = [];
    
    if (searchTerm) {
      query += ` WHERE name LIKE ? OR email LIKE ? OR role LIKE ?`;
      const like = `%${searchTerm}%`;
      params.push(like, like, like);
    }
    
    query += ` ORDER BY created_at DESC LIMIT ${Number(limit)} OFFSET ${Number(offset)}`;
    
    const [rows] = await db.execute(query, params);
    
    let countQuery = 'SELECT COUNT(*) as total FROM users';
    const countParams = [];
    if (searchTerm) {
      countQuery += ` WHERE name LIKE ? OR email LIKE ? OR role LIKE ?`;
      countParams.push(`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`);
    }
    const [countRows] = await db.execute(countQuery, countParams);

    return { data: rows, total: countRows[0].total, page: Number(page), limit: Number(limit) };
  }

  static async getAllProviders(searchTerm = '', page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    let query = `
      SELECT p.id, p.user_id, p.category, p.description, p.is_approved, u.name, u.email, u.is_blocked 
      FROM providers p 
      JOIN users u ON p.user_id = u.id 
    `;
    const params = [];

    if (searchTerm) {
      query += ` WHERE u.name LIKE ? OR u.email LIKE ? OR p.category LIKE ?`;
      const like = `%${searchTerm}%`;
      params.push(like, like, like);
    }

    query += ` ORDER BY p.created_at DESC LIMIT ${Number(limit)} OFFSET ${Number(offset)}`;

    const [rows] = await db.execute(query, params);

    let countQuery = `
      SELECT COUNT(*) as total 
      FROM providers p 
      JOIN users u ON p.user_id = u.id 
    `;
    const countParams = [];
    if (searchTerm) {
      countQuery += ` WHERE u.name LIKE ? OR u.email LIKE ? OR p.category LIKE ?`;
      const like = `%${searchTerm}%`;
      countParams.push(like, like, like);
    }
    const [countRows] = await db.execute(countQuery, countParams);

    return { data: rows, total: countRows[0].total, page: Number(page), limit: Number(limit) };
  }

  static async getAllServices(searchTerm = '', page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    let query = `
      SELECT s.*, u.name as provider_name, u.email as provider_email
      FROM services s
      JOIN users u ON s.provider_id = u.id
    `;
    const params = [];

    if (searchTerm) {
      query += ` WHERE s.title LIKE ? OR s.category LIKE ? OR u.name LIKE ? OR u.email LIKE ?`;
      const like = `%${searchTerm}%`;
      params.push(like, like, like, like);
    }

    query += ` ORDER BY s.created_at DESC LIMIT ${Number(limit)} OFFSET ${Number(offset)}`;

    const [rows] = await db.execute(query, params);

    let countQuery = `
      SELECT COUNT(*) as total 
      FROM services s
      JOIN users u ON s.provider_id = u.id
    `;
    const countParams = [];
    if (searchTerm) {
      countQuery += ` WHERE s.title LIKE ? OR s.category LIKE ? OR u.name LIKE ? OR u.email LIKE ?`;
      const like = `%${searchTerm}%`;
      countParams.push(like, like, like, like);
    }
    const [countRows] = await db.execute(countQuery, countParams);

    return { data: rows, total: countRows[0].total, page: Number(page), limit: Number(limit) };
  }
}

module.exports = AdminModel;
