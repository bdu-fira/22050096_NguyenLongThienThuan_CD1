const express = require('express');
const router = express.Router();
const CustomerTypesController = require('../../controllers/CustomerTypesController');
const { authenticate } = require('../../middlewares/auth');
const { requireRole } = require('../../middlewares/auth');

// Apply authentication middleware to all routes
router.use(authenticate);

// Define routes
router.post('/', requireRole(['Admin',"Employee"]), CustomerTypesController.create);
router.get('/', requireRole(['Admin',"Employee"]), CustomerTypesController.findAll);
router.get('/:id', requireRole(['Admin',"Employee"]), CustomerTypesController.findOne);
router.put('/:id', requireRole(['Admin',"Employee"]), CustomerTypesController.update);
router.delete('/:id', requireRole(['Admin']), CustomerTypesController.delete);

module.exports = router;