const ProviderModel = require('../models/providerModel');

class ProviderRepository {
  async create(providerData) {
    return await ProviderModel.create(providerData);
  }

  async findByUserId(userId) {
    return await ProviderModel.findByUserId(userId);
  }
}

module.exports = new ProviderRepository();
