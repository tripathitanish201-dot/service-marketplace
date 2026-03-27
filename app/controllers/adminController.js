const adminModel = require('../models/adminModel');
const auditLogsModel = require('../models/auditLogsModel');

class AdminController {
  async blockUser(req, res, next) {
    try {
      const userId = parseInt(req.params.id);
      const isBlocked = req.body.is_blocked === true;
      await adminModel.setBlockStatus(userId, isBlocked);
      
      const action = isBlocked ? 'BANNED_USER' : 'UNBANNED_USER';
      await auditLogsModel.logAction(req.user.id, action, userId, 'USER', `Admin marked user ${userId} block status: ${isBlocked}`);
      
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

      const action = isApproved ? 'APPROVED_PROVIDER' : 'REVOKED_PROVIDER';
      await auditLogsModel.logAction(req.user.id, action, providerId, 'PROVIDER', `Admin updated provider ${providerId} approval to: ${isApproved}`);

      res.status(200).json({ status: 'success', message: `Provider ${providerId} approval set to ${isApproved}` });
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req, res, next) {
    try {
      const search = req.query.search || '';
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;
      const users = await adminModel.getAllUsers(search, page, limit);
      res.status(200).json({ status: 'success', ...users });
    } catch (error) {
      next(error);
    }
  }

  async getProviders(req, res, next) {
    try {
      const search = req.query.search || '';
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;
      const providers = await adminModel.getAllProviders(search, page, limit);
      res.status(200).json({ status: 'success', ...providers });
    } catch (error) {
      next(error);
    }
  }

  async getServices(req, res, next) {
    try {
      const search = req.query.search || '';
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;
      const services = await adminModel.getAllServices(search, page, limit);
      res.status(200).json({ status: 'success', ...services });
    } catch (error) {
      next(error);
    }
  }

  async getLogs(req, res, next) {
    try {
      const search = req.query.search || '';
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;
      const logs = await auditLogsModel.getLogs(search, page, limit);
      res.status(200).json({ status: 'success', ...logs });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdminController();
