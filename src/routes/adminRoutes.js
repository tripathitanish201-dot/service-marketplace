const express = require('express');
const adminController = require('../../app/controllers/adminController');
const { authenticate, authorizeRoles } = require('../../app/middlewares/authMiddleware');
const serviceController = require('../../app/controllers/serviceController');

const router = express.Router();

router.use(authenticate);
router.use(authorizeRoles('admin'));

router.get('/users', adminController.getUsers);
router.get('/providers', adminController.getProviders);
router.get('/services', adminController.getServices);
router.get('/logs', adminController.getLogs);
router.patch('/users/:id/block', adminController.blockUser);
router.patch('/providers/:id/approve', adminController.approveProvider);
router.delete('/services/:id', serviceController.deleteService);

module.exports = router;
