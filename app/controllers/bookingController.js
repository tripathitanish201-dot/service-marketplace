const bookingService = require('../services/bookingService');

class BookingController {
  async createBooking(req, res) {
    try {
      const userId = req.user.id;
      const { service_id, booking_date } = req.body;

      if (!service_id || !booking_date) {
        return res.status(400).json({ message: 'service_id and booking_date are required' });
      }

      const booking = await bookingService.createBooking(userId, { service_id, booking_date });
      res.status(201).json({ message: 'Booking created successfully', booking });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getMyBookings(req, res) {
    try {
      const page = req.query.page ? parseInt(req.query.page) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit) : 10;

      let bookings;
      if (req.user.role === 'provider') {
        bookings = await bookingService.getProviderBookings(req.user.id, page, limit);
      } else {
        bookings = await bookingService.getUserBookings(req.user.id, page, limit);
      }
      res.status(200).json({ status: 'success', page, limit, data: bookings });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getBooking(req, res) {
    try {
      const booking = await bookingService.getBooking(req.params.id, req.user.id, req.user.role);
      res.status(200).json({ booking });
    } catch (error) {
       res.status(404).json({ message: error.message });
    }
  }

  async updateStatus(req, res) {
    try {
      const { status } = req.body;
      if (!status) {
         return res.status(400).json({ message: 'status is required' });
      }

      const booking = await bookingService.updateBookingStatus(req.params.id, req.user.id, req.user.role, status);
      res.status(200).json({ message: 'Booking status updated', booking });
    } catch (error) {
       res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new BookingController();
