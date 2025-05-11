const RoleService = require('../services/RoleService');

const createRole = async (req, res, next) => {
  try {
    const role = await RoleService.createRole(req.body);
    res.status(201).json(role);
  } catch (error) {
    next(error);
  }
};

const getAllRoles = async (req, res, next) => {
  try {
    const roles = await RoleService.findAllRoles();
    res.status(200).json(roles);
  } catch (error) {
    next(error);
  }
};

const getRoleById = async (req, res, next) => {
  try {
    const idRole = req.params.idRole;
    const role = await RoleService.findRoleById(idRole);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.status(200).json(role);
  } catch (error) {
    next(error);
  }
};

const updateRole = async (req, res, next) => {
  try {
    const idRole = req.params.idRole;
    const updatedRole = await RoleService.updateRole(idRole, req.body);
    if (!updatedRole) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.status(200).json(updatedRole);
  } catch (error) {
    next(error);
  }
};

const deleteRole = async (req, res, next) => {
  try {
    const idRole = req.params.idRole;
    const deleted = await RoleService.deleteRole(idRole);
    if (!deleted) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.status(204).send(); // No content
  } catch (error) {
    next(error);
  }
};

module.exports = { createRole, getAllRoles, getRoleById, updateRole, deleteRole };