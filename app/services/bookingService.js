const bookingRepository = require('../repositories/bookingRepository');
const serviceRepository = require('../repositories/serviceRepository');

class BookingService {
  async createBooking(userId, bookingData) {
    const { service_id, booking_date } = bookingData;

    // Ensure service exists and get provider
    const service = await serviceRepository.getServiceById(service_id);
    if (!service) {
      throw new Error('Service not found');
    }

    const bookingId = await bookingRepository.createBooking({
      user_id: userId,
      provider_id: service.provider_id,
      service_id,
      booking_date
    });

    return { id: bookingId, user_id: userId, provider_id: service.provider_id, service_id, booking_date, status: 'pending' };
  }

  async getBooking(id, userId, userRole) {
    const booking = await bookingRepository.getBookingById(id);
    if (!booking) {
      throw new Error('Booking not found');
    }

    // Access control
    if (userRole === 'user' && booking.user_id !== userId) {
      throw new Error('Unauthorized');
    }
    if (userRole === 'provider' && booking.provider_id !== userId) {
      throw new Error('Unauthorized');
    }

    return booking;
  }

  async getUserBookings(userId, page, limit) {
    return await bookingRepository.findByUser(userId, page, limit);
  }

  async getProviderBookings(providerId, page, limit) {
    return await bookingRepository.findByProvider(providerId, page, limit);
  }

  async updateBookingStatus(bookingId, userId, userRole, newStatus) {
    const validStatuses = ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(newStatus)) {
      throw new Error('Invalid status');
    }

    const booking = await bookingRepository.getBookingById(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    // Role-based status flow
    if (userRole === 'user') {
      if (booking.user_id !== userId) throw new Error('Unauthorized');
      if (newStatus !== 'cancelled') throw new Error('Users can only cancel bookings');
    }

    if (userRole === 'provider') {
      if (booking.provider_id !== userId) throw new Error('Unauthorized');
    }

    await bookingRepository.updateBookingStatus(bookingId, newStatus);
    return { ...booking, status: newStatus };
  }
}

module.exports = new BookingService();
