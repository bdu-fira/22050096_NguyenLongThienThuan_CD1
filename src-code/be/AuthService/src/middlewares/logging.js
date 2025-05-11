// // middlewares/logging.js
// const morgan = require('morgan');
// const logger = require('../config/logger'); // Assuming you have a logger instance defined

// // Use Morgan for HTTP request logging in the console
// const loggingMiddleware = morgan(
//   ':method :url :status :response-time ms - :res[content-length]',
//   {
//     stream: {
//       write: (message) => logger.info(message.trim()), // Use your logger instance
//     },
//   }
// );

// module.exports = loggingMiddleware;
