const serviceService = require('../services/serviceService');

class ServiceController {
  async createService(req, res) {
    try {
      const providerId = req.user.id;
      const { title, description, price, category, image } = req.body;

      if (!title || !price || !category) {
        return res.status(400).json({ message: 'Title, price, and category are required' });
      }

      const service = await serviceService.createService(providerId, { title, description, price, category, image });
      res.status(201).json({ message: 'Service created successfully', service });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAllServices(req, res) {
    try {
      const filters = {
        category: req.query.category,
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice) : null,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : null,
        providerId: req.query.providerId ? parseInt(req.query.providerId) : null,
        search: req.query.search || null
      };

      const page = req.query.page ? parseInt(req.query.page) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit) : 10;

      const services = await serviceService.getAllServices(filters, page, limit);
      res.status(200).json({ status: 'success', page, limit, data: services });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getServiceById(req, res) {
    try {
      const service = await serviceService.getServiceById(req.params.id);
      res.status(200).json({ service });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async updateService(req, res) {
    try {
      const providerId = req.user.id;
      const { title, description, price, category, image } = req.body;

      const service = await serviceService.updateService(req.params.id, providerId, { title, description, price, category, image });
      res.status(200).json({ message: 'Service updated successfully', service });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteService(req, res) {
    try {
      const providerId = req.user.id;
      await serviceService.deleteService(req.params.id, providerId);
      res.status(200).json({ message: 'Service deleted successfully' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new ServiceController();
