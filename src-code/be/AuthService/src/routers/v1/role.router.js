const express = require('express');
const router = express.Router();
const RoleController = require('../../controllers/RoleController');
const {authenticate} = require('../../middlewares/authenticate');
const {requireRole} = require('../../middlewares/requireRole');

// POST / - Create a new role (Admin only)
router.post('/', authenticate, requireRole(['Admin']), RoleController.createRole);

// GET / - Get all roles (Authenticated User)
router.get('/', authenticate, RoleController.getAllRoles);

// GET /:idRole - Get role by ID (Authenticated User)
router.get('/:idRole', authenticate, RoleController.getRoleById);

// PUT /:idRole - Update role by ID (Admin only)
router.put('/:idRole', authenticate, requireRole(['Admin']), RoleController.updateRole);

// DELETE /:idRole - Delete role by ID (Admin only)
router.delete('/:idRole', authenticate, requireRole(['Admin']), RoleController.deleteRole);

module.exports = router;