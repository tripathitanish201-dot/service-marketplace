const Joi = require('joi');

const serviceSchema = Joi.object({
  title: Joi.string().min(3).required(),
  description: Joi.string().optional().allow(''),
  price: Joi.number().min(0).required(),
  category: Joi.string().required(),
  image: Joi.string().uri().optional().allow('')
});

module.exports = { serviceSchema };
