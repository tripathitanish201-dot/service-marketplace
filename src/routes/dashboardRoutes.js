const express = require('express');
const dashboardController = require('../../app/controllers/dashboardController');
const { authenticate, authorizeRoles } = require('../../app/middlewares/authMiddleware');

const router = express.Router();

router.use(authenticate);

// Admin routes
router.get('/admin/stats', authorizeRoles('admin'), dashboardController.getAdminStats);

// Provider routes
router.get('/provider/earnings', authorizeRoles('provider', 'admin'), dashboardController.getProviderEarnings);

module.exports = router;
