const express = require('express');
const serviceController = require('../../app/controllers/serviceController');
const { authenticate, authorizeRoles } = require('../../app/middlewares/authMiddleware');
const validate = require('../../app/middlewares/validateMiddleware');
const { serviceSchema } = require('../../app/validations/serviceValidation');

const router = express.Router();

// Public routes
router.get('/', serviceController.getAllServices);
router.get('/:id', serviceController.getServiceById);

// Provider only routes
router.post('/', authenticate, authorizeRoles('provider', 'admin'), validate(serviceSchema), serviceController.createService);
router.put('/:id', authenticate, authorizeRoles('provider', 'admin'), validate(serviceSchema), serviceController.updateService);
router.delete('/:id', authenticate, authorizeRoles('provider', 'admin'), serviceController.deleteService);

module.exports = router;
