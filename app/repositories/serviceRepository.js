const ServiceModel = require('../models/serviceModel');

class ServiceRepository {
  async createService(serviceData) {
    return await ServiceModel.create(serviceData);
  }

  async findAll(filters, page, limit) {
    return await ServiceModel.findAll(filters, page, limit);
  }

  async getServiceById(id) {
    return await ServiceModel.findById(id);
  }

  async updateService(id, serviceData) {
    return await ServiceModel.update(id, serviceData);
  }

  async deleteService(id) {
    return await ServiceModel.delete(id);
  }
}

module.exports = new ServiceRepository();
