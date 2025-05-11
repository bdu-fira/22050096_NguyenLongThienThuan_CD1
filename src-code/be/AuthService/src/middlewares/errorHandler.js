// middlewares/errorHandler.js

const errorHandler = (err, req, res, next) => {
  // Log the error (for debugging purposes)
  console.error(err.stack);

  // Customize error response based on error type
  if (err.name === 'ValidationError') {
    // Sequelize validation error
    return res.status(400).json({ message: err.message, errors: err.errors });
  }

  if (err.name === 'UnauthorizedError') {
        // JWT authentication error
        return res.status(401).json({ message: 'Unauthorized', error: err.message });
  }

  if (err.status) {
    // Known error with specific status code
    return res.status(err.status).json({ message: err.message });
  }

  // Default error response (Internal Server Error)
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
};

module.exports = errorHandler;