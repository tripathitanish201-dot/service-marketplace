const db = require('../../config/db');

class AuditLogsModel {
  static async logAction(userId, action, targetId = null, targetType = null, details = null) {
    try {
      await db.execute(
        'INSERT INTO audit_logs (user_id, action, target_id, target_type, details) VALUES (?, ?, ?, ?, ?)',
        [userId, action, targetId, targetType, details]
      );
    } catch (error) {
      console.error('Failed to write audit log:', error.message);
      // We don't throw here to avoid dropping valid transactions just because logging failed.
    }
  }

  static async getLogs(searchTerm = '', page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    let query = `
      SELECT a.*, u.name as user_name, u.email as user_email
      FROM audit_logs a
      LEFT JOIN users u ON a.user_id = u.id
    `;
    const params = [];

    if (searchTerm) {
      query += ` WHERE a.action LIKE ? OR u.name LIKE ? OR u.email LIKE ? OR a.details LIKE ? `;
      const like = `%${searchTerm}%`;
      params.push(like, like, like, like);
    }

    query += ` ORDER BY a.created_at DESC LIMIT ${Number(limit)} OFFSET ${Number(offset)}`;

    const [rows] = await db.execute(query, params);
    
    // Get total count
    let countQuery = `
      SELECT COUNT(*) as total 
      FROM audit_logs a
      LEFT JOIN users u ON a.user_id = u.id
    `;
    const countParams = [];
    if (searchTerm) {
      countQuery += ` WHERE a.action LIKE ? OR u.name LIKE ? OR u.email LIKE ? OR a.details LIKE ? `;
      const like = `%${searchTerm}%`;
      countParams.push(like, like, like, like);
    }
    const [countRows] = await db.execute(countQuery, countParams);

    return {
      logs: rows,
      total: countRows[0].total,
      page: Number(page),
      limit: Number(limit)
    };
  }
}

module.exports = AuditLogsModel;
