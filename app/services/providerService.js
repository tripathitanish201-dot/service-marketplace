const providerRepository = require('../repositories/providerRepository');

class ProviderService {
  async createProfile(userId, profileData) {
    const existing = await providerRepository.findByUserId(userId);
    if (existing) {
      throw Object.assign(new Error('Provider profile already exists'), { status: 400 });
    }

    const providerData = {
      user_id: userId,
      bio: profileData.bio,
      experience: profileData.experience
    };

    return await providerRepository.create(providerData);
  }

  async getProfile(userId) {
    const profile = await providerRepository.findByUserId(userId);
    if (!profile) {
      throw Object.assign(new Error('Profile not found'), { status: 404 });
    }
    return profile;
  }
}

module.exports = new ProviderService();
