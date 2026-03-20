const dashboardRepository = require('../repositories/dashboardRepository');

class DashboardService {
  async getAdminStats() {
    return await dashboardRepository.getAdminStats();
  }

  async getProviderEarnings(providerId) {
    const earnings = await dashboardRepository.getProviderEarnings(providerId);
    return {
      total_earnings: earnings.total_earnings || 0
    };
  }
}

module.exports = new DashboardService();
