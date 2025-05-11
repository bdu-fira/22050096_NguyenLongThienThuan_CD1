const express = require('express');
const router = express.Router();
const ProductsController = require('../../controllers/ProductsController');
const { authenticate, requireRole } = require('../../middlewares/auth');

// Route to create a new product
router.post('/', authenticate, requireRole(['Admin', 'Employee']), ProductsController.create);

// Route to get all products
router.get('/', ProductsController.findAll);

// Route to get a product by ID
router.get('/:id', authenticate, ProductsController.findOne);

// Route to update a product by ID
router.put('/:id', authenticate, requireRole(['Admin', 'Employee']), ProductsController.update);

// // Route to delete a product by ID
router.delete('/:id', authenticate, requireRole(['Admin', 'Employee']), ProductsController.remove);

module.exports = router;