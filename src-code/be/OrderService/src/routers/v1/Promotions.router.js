const express = require('express');
const router = express.Router();
const PromotionsController = require('../../controllers/PromotionsController');
const { authenticate, requireRole } = require('../../middlewares/auth');

// Route to create a new promotion
router.post('/', authenticate, requireRole(['Admin', 'Employee']), PromotionsController.create);

// Route to get all promotions
router.get('/', authenticate, PromotionsController.findAll);

// Route to get a specific promotion by ID
router.get('/:id', authenticate, PromotionsController.findOne);

// Route to update a promotion by ID
router.put('/:id', authenticate, requireRole(['Admin', 'Employee']), PromotionsController.update);

// // Route to delete a promotion by ID
// router.delete('/:id', authenticate, requireRole(['Admin', 'Employee']), PromotionsController.delete);

// Route to apply a promotion to a product
router.post('/:promoId/products/:productId', authenticate, requireRole(['Admin', 'Employee']), PromotionsController.applyToProduct);

// Route to remove a promotion from a product
router.delete('/:promoId/products/:productId', authenticate, requireRole(['Admin', 'Employee']), PromotionsController.removeFromProduct);

module.exports = router;