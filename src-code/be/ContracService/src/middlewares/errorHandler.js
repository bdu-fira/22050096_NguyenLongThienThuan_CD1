module.exports = (err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Customize error response based on the environment (development/production)
  const errorResponse = {
    error: {
      message: message,
      // Only include stack trace in development
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    },
  };

  res.status(statusCode).json(errorResponse);
};
