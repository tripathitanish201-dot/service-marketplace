const DashboardModel = require('../models/dashboardModel');

class DashboardRepository {
  async getAdminStats() {
    return await DashboardModel.getAdminStats();
  }

  async getProviderEarnings(providerId) {
    return await DashboardModel.getProviderEarnings(providerId);
  }
}

module.exports = new DashboardRepository();
