const express = require('express');
const router = express.Router();
const proxyRouter = require('./proxy.router');

// Định nghĩa các route proxy
router.use('/',proxyRouter);

module.exports = router;