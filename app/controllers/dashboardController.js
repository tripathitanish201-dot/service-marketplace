const dashboardService = require('../services/dashboardService');

class DashboardController {
  async getAdminStats(req, res) {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access forbidden: Admins only' });
      }

      const stats = await dashboardService.getAdminStats();
      res.status(200).json(stats);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getProviderEarnings(req, res) {
    try {
      if (req.user.role !== 'provider' && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access forbidden: Providers only' });
      }

      const earnings = await dashboardService.getProviderEarnings(req.user.id);
      res.status(200).json(earnings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new DashboardController();
