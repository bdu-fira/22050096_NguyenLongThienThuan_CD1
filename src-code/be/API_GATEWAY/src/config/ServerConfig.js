const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL || "http://localhost:4001",
  ORDER_SERVICE_URL: process.env.ORDER_SERVICE_URL || "http://localhost:4002",
  CONTRACT_SERVICE_URL: process.env.CONTRACT_SERVICE_URL || "http://localhost:4003",
  PORT:process.env.PORT ||4000,
};
