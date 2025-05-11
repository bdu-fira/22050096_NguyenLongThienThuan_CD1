require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD|| "",
    database: process.env.DB_NAME || "bb",
    host: process.env.DB_HOST ||"",
    dialect: 'mysql',
    port: process.env.DB_PORT || 3309,
    jwtSecret: process.env.JWT_SECRET || '',
    logging: process.env.NODE_ENV !== 'test' ? console.log : false,
    mail:process.env.MAIL_APP||"",
    appPassword:process.env.PASSWORD_APP||""
  },
  test: {
    username: process.env.DB_USER_TEST,
    password: process.env.DB_PASSWORD_TEST,
    database: process.env.DB_NAME_TEST,
    host: process.env.DB_HOST_TEST,
    dialect: 'mysql',
    port: process.env.DB_PORT_TEST || 3306,
    jwtSecret: process.env.JWT_SECRET || '',
    logging: false,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
    jwtSecret: process.env.JWT_SECRET || '',
    logging: false,
  },
  jwtExpiration: process.env.JWT_EXPIRATION || '12h',
  jwtRefreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
  port:process.env.PORT || 4001
};

