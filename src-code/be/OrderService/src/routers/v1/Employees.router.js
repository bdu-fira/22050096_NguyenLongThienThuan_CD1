const express = require('express');
const router = express.Router();
const EmployeesController = require('../../controllers/EmployeesController');
const { authenticate } = require('../../middlewares/auth');
const { requireRole } = require('../../middlewares/auth');
const { validate } = require('../../middlewares/validation');

// POST / - Create a new employee (Admin only)
router.post('/', authenticate, requireRole(['Admin',"Employee"]), EmployeesController.create);

// GET / - Get all employees (Admin only)
router.get('/', authenticate, requireRole(['Admin']), EmployeesController.findAll);

// GET /:id - Get an employee by staff_id
router.get('/:id', authenticate, EmployeesController.findOne);

// GET /user/:iduser - Get an employee by iduser
router.get('/user/:iduser', authenticate, EmployeesController.findOneByIdUser);

// PUT /:id - Update an employee by staff_id (Admin only)
router.put('/:id', authenticate, requireRole(['Admin',"Employee"]), EmployeesController.update);

// // DELETE /:id - Delete an employee by staff_id (Admin only)
// router.delete('/:id', authenticate, requireRole(['Admin']), EmployeesController.delete);

module.exports = router;