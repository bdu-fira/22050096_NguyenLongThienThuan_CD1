const express = require('express');
const router = express.Router();
const ContractController = require('../../controllers/ContractController');
const { authenticate } = require('../../middlewares/auth');
const { requireRole } = require('../../middlewares/auth');

// GET /contracts
router.get('/', authenticate, requireRole(['Admin', 'Employee']), ContractController.getAllContracts);

// GET /contracts/:contract_id
router.get('/:contract_id', authenticate, requireRole(['Admin', 'Employee']), ContractController.getContractById);

// GET /contracts/order/:order_id
router.get('/order/:order_id', authenticate, requireRole(['Admin', 'Employee']), ContractController.getContractByOrderId);

// PUT /contracts/:contract_id/status
router.put('/:contract_id/status', authenticate, requireRole(['Admin', 'Employee']), ContractController.updateContractStatus);

// PUT /contracts/:contract_id
router.put('/:contract_id', authenticate, requireRole(['Admin', 'Employee']), ContractController.updateContractDetails);

// DELETE /contracts/:contract_id
router.delete('/:contract_id', authenticate, requireRole(['Admin']), ContractController.deleteContract);

module.exports = router;