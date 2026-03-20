const userService = require('../services/userService');

class UserController {
  async register(req, res) {
    try {
      const { name, email, password, role } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      const validRoles = ['user', 'provider', 'admin'];
      if (role && !validRoles.includes(role)) {
        return res.status(400).json({ message: 'Invalid role passed. Must be user, provider, or admin' });
      }

      const user = await userService.registerUser({ name, email, password, role });
      res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      const result = await userService.loginUser(email, password);
      res.status(200).json({ message: 'Login successful', ...result });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }

  async getProfile(req, res) {
    try {
      const userId = req.user.id;
      const user = await userService.getUserProfile(userId);
      res.status(200).json({ user });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
}

module.exports = new UserController();
