const express = require('express');
const router = express.Router();
const CustomersController = require('../../controllers/CustomersController');
const { authenticate } = require('../../middlewares/auth');
const { requireRole } = require('../../middlewares/auth');
const { validate } = require('../../middlewares/validation');

// POST / - Create a new customer
router.post('/', authenticate,requireRole(['Customer']), CustomersController.create);

// GET / - Get all customers (Admin/Employee only)
router.get('/', authenticate, requireRole(['Admin', 'Employee']), CustomersController.findAll);

// GET /:id - Get a customer by customer_id
router.get('/:id', authenticate, CustomersController.findOne);

// GET /user/:iduser - Get a customer by iduser
router.get('/user/:iduser', authenticate, CustomersController.findOneByIdUser);

// PUT /:id - Update a customer by customer_id
router.put('/:id', authenticate, CustomersController.update);

// DELETE /:id - Delete a customer by customer_id (Admin/Employee only)
router.delete('/:id', authenticate, requireRole(['Admin', 'Employee']), CustomersController.delete);

module.exports = router;