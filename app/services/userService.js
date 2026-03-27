const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class UserService {
  async registerUser(userData) {
    const existingUser = await userRepository.getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const userId = await userRepository.createUser({
      ...userData,
      password: hashedPassword
    });

    return { id: userId, name: userData.name, email: userData.email, role: userData.role || 'user' };
  }

  async loginUser(email, password) {
    const user = await userRepository.getUserByEmail(email);
    if (!user) {
      throw Object.assign(new Error('Invalid email or password'), { status: 401 });
    }

    if (user.is_blocked) {
      throw Object.assign(new Error('Your account has been suspended by the administrator.'), { status: 403 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw Object.assign(new Error('Invalid email or password'), { status: 401 });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token
    };
  }

  async getUserProfile(userId) {
    const user = await userRepository.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}

module.exports = new UserService();
