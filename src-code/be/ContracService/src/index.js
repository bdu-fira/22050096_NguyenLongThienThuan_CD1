const express = require('express');
const cors = require('cors');
const v1Router = require('./routers/v1/index');
const { startConsumer } = require('./kafka/index');
const errorHandler = require('./middlewares/errorHandler');
const db = require('./models/index');
const config = require('./config/index');

const app = express();
const port = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json()); // parse application/json
app.use(express.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

// Routes
app.use('/api/v1', v1Router);

// Kafka Consumer
startConsumer();

// Error Handler
app.use(errorHandler);

// DB sync and start server
db.sequelize.sync({ alter: false }).then(() => {
  app.listen(port, () => {
    console.log(`✅ Contract Service is running on port ${port}`);
  });
}).catch((err) => {
  console.error('❌ Database sync failed:', err);
});
