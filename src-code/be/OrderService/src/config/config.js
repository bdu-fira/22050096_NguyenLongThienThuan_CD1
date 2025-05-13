// config/config.js
require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD|| "thienthuan",
    database: process.env.DB_NAME || "bb",
    host: process.env.DB_HOST ||"localhost",
    dialect: 'mysql',
    port: process.env.DB_PORT || 3309,
    jwtSecret: process.env.JWT_SECRET || 'secret-key',
    mail:process.env.MAIL_APP||"",
    appPassword:process.env.PASSWORD_APP||"",
    logging: process.env.NODE_ENV !== 'test' ? console.log : false,
  },
  test: {
    username: process.env.DB_USER_TEST,
    password: process.env.DB_PASSWORD_TEST,
    database: process.env.DB_NAME_TEST,
    host: process.env.DB_HOST_TEST,
    dialect: 'mysql',
    port: process.env.DB_PORT_TEST || 3306,
  },
  production: {
    username: process.env.DB_USER_PROD,
    password: process.env.DB_PASSWORD_PROD,
    database: process.env.DB_NAME_PROD,
    host: process.env.DB_HOST_PROD,
    dialect: 'mysql',
    port: process.env.DB_PORT_PROD || 3306,
  },
  kafka: {
    clientId: process.env.KAFKA_CLIENT_ID || 'order-service',
    brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
    contractCreateRequestTopic: process.env.KAFKA_CONTRACT_CREATE_TOPIC || 'contract.create-request',
  },
  jwtSecret: process.env.JWT_SECRET || 'your-default-secret-key',
  authServiceUrl: process.env.AUTH_SERVICE_URL || 'http://localhost:4001',
};
