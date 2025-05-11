const express = require('express');
const router = express.Router();
const CategoriesController = require('../../controllers/CategoriesController');
const { authenticate, requireRole } = require('../../middlewares/auth');

// Route to create a new category
router.post('/', authenticate, requireRole(['Admin', 'Employee']), CategoriesController.create);

// Route to get all categories
router.get('/', CategoriesController.findAll);

// Route to get a category by ID
router.get('/:id', authenticate, CategoriesController.findOne);

// Route to update a category by ID
router.put('/:id', authenticate, requireRole(['Admin', 'Employee']), CategoriesController.update);

// Route to delete a category by ID
router.delete('/:id', authenticate, requireRole(['Admin', 'Employee']), CategoriesController.remove);

module.exports = router;