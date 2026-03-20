const db = require('../../config/db');

class BookingModel {
  static async create(booking) {
    const { user_id, provider_id, service_id, booking_date } = booking;
    const [result] = await db.execute(
      'INSERT INTO bookings (user_id, provider_id, service_id, booking_date) VALUES (?, ?, ?, ?)',
      [user_id, provider_id, service_id, booking_date]
    );
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM bookings WHERE id = ?', [id]);
    return rows[0];
  }

  static async findByUser(userId, page = 1, limit = 10) {
    const parsedLimit = parseInt(limit, 10) || 10;
    const parsedPage = parseInt(page, 10) || 1;
    const offset = (parsedPage - 1) * parsedLimit;

    const [rows] = await db.execute(
      `SELECT * FROM bookings WHERE user_id = ? ORDER BY booking_date DESC LIMIT ${parsedLimit} OFFSET ${offset}`,
      [userId]
    );
    return rows;
  }

  static async findByProvider(providerId, page = 1, limit = 10) {
    const parsedLimit = parseInt(limit, 10) || 10;
    const parsedPage = parseInt(page, 10) || 1;
    const offset = (parsedPage - 1) * parsedLimit;

    const [rows] = await db.execute(
      `SELECT * FROM bookings WHERE provider_id = ? ORDER BY booking_date DESC LIMIT ${parsedLimit} OFFSET ${offset}`,
      [providerId]
    );
    return rows;
  }

  static async updateStatus(id, status) {
    const [result] = await db.execute(
      'UPDATE bookings SET status = ? WHERE id = ?',
      [status, id]
    );
    return result.affectedRows;
  }
}

module.exports = BookingModel;
