const serviceRepository = require('../repositories/serviceRepository');

class ServiceService {
  async createService(providerId, serviceData) {
    const serviceId = await serviceRepository.createService({
      ...serviceData,
      provider_id: providerId
    });
    return { id: serviceId, ...serviceData, provider_id: providerId };
  }

  async getAllServices(filters, page, limit) {
    return await serviceRepository.findAll(filters, page, limit);
  }

  async getServiceById(id) {
    const service = await serviceRepository.getServiceById(id);
    if (!service) {
      throw new Error('Service not found');
    }
    return service;
  }

  async updateService(serviceId, providerId, serviceData) {
    const service = await serviceRepository.getServiceById(serviceId);
    if (!service) {
      throw new Error('Service not found');
    }
    if (service.provider_id !== providerId) {
      throw new Error('Unauthorized to update this service');
    }

    await serviceRepository.updateService(serviceId, serviceData);
    return { id: serviceId, ...serviceData, provider_id: providerId };
  }

  async deleteService(serviceId, providerId) {
    const service = await serviceRepository.getServiceById(serviceId);
    if (!service) {
      throw new Error('Service not found');
    }
    if (service.provider_id !== providerId) {
      throw new Error('Unauthorized to delete this service');
    }

    await serviceRepository.deleteService(serviceId);
    return true;
  }
}

module.exports = new ServiceService();
