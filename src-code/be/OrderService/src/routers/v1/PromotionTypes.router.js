const express = require('express');
const router = express.Router();
const PromotionTypesController = require('../../controllers/PromotionTypesController');
const { authenticate, requireRole } = require('../../middlewares/auth');

// Route to create a new promotion type
router.post('/', authenticate, requireRole(['Admin', 'Employee']), PromotionTypesController.create);

// Route to get all promotion types
router.get('/', authenticate, PromotionTypesController.findAll);

// Route to get a specific promotion type by ID
router.get('/:id', authenticate, PromotionTypesController.findOne);

// Route to update a promotion type by ID
router.put('/:id', authenticate, requireRole(['Admin', 'Employee']), PromotionTypesController.update);

// Route to delete a promotion type by ID
router.delete('/:id', authenticate, requireRole(['Admin', 'Employee']), PromotionTypesController.remove);

module.exports = router;