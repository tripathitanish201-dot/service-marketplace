const errorHandler = (err, req, res, next) => {
  console.error('[Error]: ', err.message || err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    status: 'error',
    message: err.message || 'Internal Server Error'
  });
};

module.exports = errorHandler;
