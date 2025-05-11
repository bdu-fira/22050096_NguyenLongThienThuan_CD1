const express = require('express');
const cors = require('cors');
const { PORT } = require('./config/ServerConfig');
const apiRouter = require('./routers/index');
const {loggingMiddleware} = require('./middlewares/logging.middleware');

const app = express();

// Middleware
app.use(cors());


// Logging middleware (optional)
app.use(loggingMiddleware);

// Routes

app.use('/',apiRouter);

// Start server
app.listen(PORT, () => {
  console.log(`API Gateway listening on port ${PORT}`);
});

module.exports = app;