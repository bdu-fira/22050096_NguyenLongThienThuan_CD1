// config/jwt.js

require('dotenv').config();

module.exports = {
  secret: process.env.JWT_SECRET || 'your-secret-key',
  expiresIn: '1h', // e.g., '24h', '1d', '10m'
};
