const express = require('express');
const contractRouter = require('./contract.router');

const router = express.Router();

router.use('/contracts', contractRouter);

module.exports = router;