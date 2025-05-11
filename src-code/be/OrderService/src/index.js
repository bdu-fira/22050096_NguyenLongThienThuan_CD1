const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const models = require('./models');
const routers = require('./routers');
const errorHandler = require('./middlewares/errorHandler');
const corsConfig = require('./config/cors');

// Load environment variables from .env file
dotenv.config();

// Create an Express application
const app = express();

// Middleware configuration
// Enable CORS
app.use(cors());

// Logging middleware
app.use(morgan('dev'));

// Parse request bodies (JSON and URL-encoded)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection and model initialization
// models.sequelize
//   .sync()
//   .then(() => {
//     console.log('Database connection has been established successfully.');
//   })
//   .catch((err) => {
//     console.error('Unable to connect to the database:', err);
//   });

// Mount the application's routers
app.use('/api/v1',routers);

// Centralized error handling middleware
app.use(errorHandler);

// Start the server
const port = process.env.PORT || 4002;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = { app };