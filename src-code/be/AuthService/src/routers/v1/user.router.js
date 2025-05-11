const express = require('express');
const router = express.Router();
const UserController = require('../../controllers/UserController');
const {authenticate} = require('../../middlewares/authenticate');
const {requireRole} = require('../../middlewares/requireRole');

// POST / - Create a new user (Admin only)
router.post('/', authenticate, requireRole(['Admin']), UserController.createUser);

// GET / - Get all users (Admin only)
router.get('/', authenticate, requireRole(['Admin']), UserController.getAllUsers);

// GET /:iduser - Get user by ID (Admin or self)
router.get('/:iduser', authenticate, (req, res, next) => {
  // Allow admin or the user themselves to access this route
  if (res.locals.user.iduser === parseInt(req.params.iduser) || res.locals.user.roles.some(role => role.name === 'Admin')) {
    next();
  } else {
    requireRole(['Admin'])(req, res, next); // Use requireRole to handle unauthorized access
  }
}, UserController.getUserById);

// PUT /:iduser - Update user by ID (Admin or self)
router.put('/:iduser', authenticate, (req, res, next) => {
  // Allow admin or the user themselves to access this route
  if (res.locals.user.iduser === parseInt(req.params.iduser) || res.locals.user.roles.some(role => role.name === 'Admin')) {
    next();
  } else {
    requireRole(['Admin'])(req, res, next); // Use requireRole to handle unauthorized access
  }
}, UserController.updateUser);

// DELETE /:iduser - Delete user by ID (Admin only)
router.delete('/:iduser', authenticate, requireRole(['Admin']), UserController.deleteUser);

module.exports = router;