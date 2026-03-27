const express = require('express');
const providerController = require('../../app/controllers/providerController');
const { authenticate, authorizeRoles } = require('../../app/middlewares/authMiddleware');
const validate = require('../../app/middlewares/validateMiddleware');
const Joi = require('joi');

const profileSchema = Joi.object({
  bio: Joi.string().required(),
  experience: Joi.string().required()
});

const router = express.Router();

router.post('/profile', authenticate, authorizeRoles('provider', 'admin'), validate(profileSchema), providerController.createProfile);
router.get('/profile', authenticate, providerController.getProfile);
router.get('/profile/:userId', authenticate, providerController.getProfile);

module.exports = router;
