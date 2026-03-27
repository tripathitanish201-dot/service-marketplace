const db = require('../../config/db');

class DashboardModel {
  static async getAdminStats() {
    const [stats] = await db.execute(`
      SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM users WHERE role = 'provider') as total_providers,
        (SELECT COUNT(*) FROM bookings) as total_bookings
    `);

    const [revenueRows] = await db.execute(`
      SELECT COALESCE(SUM(s.price), 0) as gm_value
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      WHERE b.status = 'completed'
    `);

    const gmValue = parseFloat(revenueRows[0].gm_value);
    const platform_profit = gmValue * 0.15;

    return {
      total_users: stats[0].total_users,
      total_providers: stats[0].total_providers,
      total_bookings: stats[0].total_bookings,
      gross_market_value: gmValue,
      platform_profit: platform_profit
    };
  }

  static async getProviderEarnings(providerId) {
    const [result] = await db.execute(`
      SELECT COALESCE(SUM(s.price), 0) as gm_value
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      WHERE b.provider_id = ? AND b.status = 'completed'
    `, [providerId]);

    const gmValue = parseFloat(result[0].gm_value);
    return {
      total_earnings: gmValue * 0.85
    };
  }
}

module.exports = DashboardModel;
