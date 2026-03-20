const Joi = require('joi');

const reviewSchema = Joi.object({
  provider_id: Joi.number().integer().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().optional().allow('')
});

module.exports = { reviewSchema };
