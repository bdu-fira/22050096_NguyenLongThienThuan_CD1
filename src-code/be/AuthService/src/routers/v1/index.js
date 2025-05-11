const express = require('express');
const router = express.Router();
const authRouter = require('./auth.router');
const userRouter = require('./user.router');
const roleRouter = require('./role.router');
const roleUserRouter = require('./roleUser.router');

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/roles', roleRouter);
router.use('/role-users', roleUserRouter);

module.exports = router;