const db = require('../../config/db');

class DashboardModel {
  static async getAdminStats() {
    const [stats] = await db.execute(`
      SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM users WHERE role = 'provider') as total_providers,
        (SELECT COUNT(*) FROM bookings) as total_bookings
    `);
    return stats[0];
  }

  static async getProviderEarnings(providerId) {
    const [result] = await db.execute(`
      SELECT SUM(s.price) as total_earnings
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      WHERE b.provider_id = ? AND b.status = 'completed'
    `, [providerId]);
    return result[0];
  }
}

module.exports = DashboardModel;
