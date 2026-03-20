const Joi = require('joi');

const bookingSchema = Joi.object({
  service_id: Joi.number().integer().required(),
  booking_date: Joi.date().iso().required()
});

const statusSchema = Joi.object({
  status: Joi.string().valid('pending', 'accepted', 'in_progress', 'completed', 'cancelled').required()
});

module.exports = { bookingSchema, statusSchema };
