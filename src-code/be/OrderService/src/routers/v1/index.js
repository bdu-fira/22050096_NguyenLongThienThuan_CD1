const express = require('express');
const router = express.Router();

const customerTypesRouter = require('./CustomerTypes.router');
const customersRouter = require('./Customers.router');
const employeesRouter = require('./Employees.router');
const categoriesRouter = require('./Categories.router');
const productsRouter = require('./Products.router');
const promotionTypesRouter = require('./PromotionTypes.router');
const promotionsRouter = require('./Promotions.router');
const ordersRouter = require('./Orders.router');

// Mount routers
router.use('/customer-types', customerTypesRouter);
router.use('/customers', customersRouter);
router.use('/employees', employeesRouter);
router.use('/categories', categoriesRouter);
router.use('/products', productsRouter);
router.use('/promotion-types', promotionTypesRouter);
router.use('/promotions', promotionsRouter);
router.use('/orders', ordersRouter);

module.exports = router;