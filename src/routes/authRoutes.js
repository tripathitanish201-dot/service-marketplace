const express = require('express');
const userController = require('../../app/controllers/userController');
const { authenticate, authorizeRoles } = require('../../app/middlewares/authMiddleware');
const validate = require('../../app/middlewares/validateMiddleware');
const { registerSchema, loginSchema } = require('../../app/validations/authValidation');

const router = express.Router();

router.post('/register', validate(registerSchema), userController.register);
router.post('/login', validate(loginSchema), userController.login);
router.get('/profile', authenticate, userController.getProfile);

module.exports = router;
