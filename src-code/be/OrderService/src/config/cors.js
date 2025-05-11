// config/cors.js

const allowedOrigins = [
  'http://localhost:3000', // Example: Your frontend application
  'http://example.com',   // Example: Another trusted origin
  // Add more origins as needed
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) { // Allow requests with no origin (like mobile apps or curl requests)
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow cookies to be sent back
  allowedHeaders: 'Content-Type, Authorization, *',
};

module.exports = corsOptions;
