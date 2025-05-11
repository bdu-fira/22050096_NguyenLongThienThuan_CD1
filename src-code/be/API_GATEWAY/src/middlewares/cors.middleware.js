// middlewares/cors.middleware.js

const corsMiddleware = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Cho phép tất cả các origin
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
};

module.exports = { corsMiddleware };