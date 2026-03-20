const BookingModel = require('../models/bookingModel');

class BookingRepository {
  async createBooking(bookingData) {
    return await BookingModel.create(bookingData);
  }

  async getBookingById(id) {
    return await BookingModel.findById(id);
  }

  async findByUser(userId, page, limit) {
    return await BookingModel.findByUser(userId, page, limit);
  }

  async findByProvider(providerId, page, limit) {
    return await BookingModel.findByProvider(providerId, page, limit);
  }

  async updateBookingStatus(id, status) {
    return await BookingModel.updateStatus(id, status);
  }
}

module.exports = new BookingRepository();
