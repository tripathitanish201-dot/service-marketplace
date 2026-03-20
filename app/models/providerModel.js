const db = require('../../config/db');

class ProviderModel {
  static async create(providerData) {
    const { user_id, bio, experience } = providerData;
    const [result] = await db.execute(
      'INSERT INTO providers (user_id, bio, experience) VALUES (?, ?, ?)',
      [user_id, bio, experience]
    );
    return result.insertId;
  }

  static async findByUserId(userId) {
    const [rows] = await db.execute('SELECT * FROM providers WHERE user_id = ?', [userId]);
    return rows[0];
  }

  static async updateRating(providerId, rating) {
    await db.execute('UPDATE providers SET rating = ? WHERE user_id = ?', [rating, providerId]);
  }
}

module.exports = ProviderModel;
