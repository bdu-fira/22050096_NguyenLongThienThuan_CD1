const express = require('express');
const router = express.Router();
const RoleUserController = require('../../controllers/RoleUserController');
const { authenticate } = require('../../middlewares/authenticate');
const { requireRole } = require('../../middlewares/requireRole');

// Route to assign a role to a user (Admin only)
router.post('/', authenticate, requireRole(['Admin']), RoleUserController.assignRoleToUser);

// Route to get all role-user assignments (Admin only)
router.get('/', authenticate, requireRole(['Admin']), RoleUserController.getAllRoleUsers);

// Route to get a specific role-user assignment by ID (Admin only)
router.get('/:idRoleUser', authenticate, requireRole(['Admin']), RoleUserController.getRoleUserById);

// Route to get all roles for a specific user (Admin only)
router.get('/user/:iduser', authenticate, requireRole(['Admin']), RoleUserController.getRolesByUserId);

// Route to get all users for a specific role (Admin only)
router.get('/role/:idRole', authenticate, requireRole(['Admin']), RoleUserController.getUsersByRoleId);

// Route to remove a role-user assignment by ID (Admin only)
router.delete('/:idRoleUser', authenticate, requireRole(['Admin']), RoleUserController.removeRoleAssignmentById);

// Route to remove a specific role from a user (Admin only)
router.delete('/user/:iduser/role/:idRole', authenticate, requireRole(['Admin']), RoleUserController.removeRoleFromUser);

module.exports = router;