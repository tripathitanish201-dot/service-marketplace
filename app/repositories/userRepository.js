const User = require('../models/userModel');

class UserRepository {
  async createUser(userData) {
    return await User.create(userData);
  }

  async getUserByEmail(email) {
    return await User.findByEmail(email);
  }

  async getUserById(id) {
    return await User.findById(id);
  }
}

module.exports = new UserRepository();
