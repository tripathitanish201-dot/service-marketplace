const adminModel = require('../models/adminModel');

class AdminController {
  async blockUser(req, res, next) {
    try {
      const userId = parseInt(req.params.id);
      const isBlocked = req.body.is_blocked === true;
      await adminModel.setBlockStatus(userId, isBlocked);
      res.status(200).json({ status: 'success', message: `User ${userId} blocked status set to ${isBlocked}` });
    } catch (error) {
      next(error);
    }
  }

  async approveProvider(req, res, next) {
    try {
      const providerId = parseInt(req.params.id);
      const isApproved = req.body.is_approved === true;
      await adminModel.setProviderApproval(providerId, isApproved);
      res.status(200).json({ status: 'success', message: `Provider ${providerId} approval set to ${isApproved}` });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdminController();
