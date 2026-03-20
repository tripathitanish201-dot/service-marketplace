const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessage = error.details.map(details => details.message).join(', ');
      return res.status(400).json({ status: 'error', message: errorMessage });
    }
    req.body = value;
    next();
  };
};

module.exports = validate;
