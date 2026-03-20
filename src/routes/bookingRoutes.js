const express = require('express');
const bookingController = require('../../app/controllers/bookingController');
const { authenticate } = require('../../app/middlewares/authMiddleware');
const validate = require('../../app/middlewares/validateMiddleware');
const { bookingSchema, statusSchema } = require('../../app/validations/bookingValidation');

const router = express.Router();

// Require auth for all booking routes
router.use(authenticate);

router.post('/', validate(bookingSchema), bookingController.createBooking);
router.get('/', bookingController.getMyBookings);
router.get('/:id', bookingController.getBooking);
router.patch('/:id/status', validate(statusSchema), bookingController.updateStatus);

module.exports = router;
