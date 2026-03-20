const db = require('../../config/db');

class ReviewModel {
  static async create(review) {
    const { user_id, provider_id, rating, comment } = review;
    const [result] = await db.execute(
      'INSERT INTO reviews (user_id, provider_id, rating, comment) VALUES (?, ?, ?, ?)',
      [user_id, provider_id, rating, comment]
    );
    return result.insertId;
  }

  static async findByProviderId(providerId) {
    const [rows] = await db.execute('SELECT * FROM reviews WHERE provider_id = ? ORDER BY created_at DESC', [providerId]);
    return rows;
  }

  static async getAverageRating(providerId) {
    const [rows] = await db.execute('SELECT AVG(rating) as average_rating, COUNT(id) as total_reviews FROM reviews WHERE provider_id = ?', [providerId]);
    return rows[0];
  }
}

module.exports = ReviewModel;
