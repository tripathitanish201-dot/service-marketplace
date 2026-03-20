const db = require('../../config/db');

class AdminModel {
  static async setBlockStatus(userId, status) {
    await db.execute('UPDATE users SET is_blocked = ? WHERE id = ?', [status, userId]);
  }

  static async setProviderApproval(providerId, status) {
    await db.execute('UPDATE providers SET is_approved = ? WHERE id = ?', [status, providerId]);
  }
}

module.exports = AdminModel;
