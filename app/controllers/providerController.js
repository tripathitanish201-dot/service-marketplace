const providerService = require('../services/providerService');

class ProviderController {
  async createProfile(req, res, next) {
    try {
      const profileId = await providerService.createProfile(req.user.id, req.body);
      res.status(201).json({ status: 'success', message: 'Profile created successfully', profileId });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      const targetUserId = req.params.userId ? parseInt(req.params.userId) : req.user.id;
      const profile = await providerService.getProfile(targetUserId);
      res.status(200).json({ status: 'success', data: profile });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProviderController();
