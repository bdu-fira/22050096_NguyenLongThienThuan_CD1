const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
// const loggingMiddleware = require('./middlewares/logging');
const errorHandlerMiddleware = require('./middlewares/errorHandler');
const v1Router = require('./routers/v1');
const db = require('./models');
const config = require('./config/config');

const app = express();
const port = config.port || 4001;

// Middleware
app.use(cors());
app.use(express.json()); // ✅ cần cái này!
app.use(express.urlencoded({ extended: true })); // ✅ hỗ trợ form data


// Routes
app.use('/api/v1', v1Router);

// Error handling
app.use(errorHandlerMiddleware);

// Sync database and start server
db.sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});