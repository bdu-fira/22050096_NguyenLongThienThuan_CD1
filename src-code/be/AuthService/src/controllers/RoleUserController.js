const RoleUserService = require('../services/RoleUserService');

const assignRoleToUser = async (req, res, next) => {
  try {
    const { idUser, idRole } = req.body;
    const roleUser = await RoleUserService.assignRole({idUser, idRole});
    res.status(201).json(roleUser);
  } catch (error) {
    next(error);
  }
};

const getAllRoleUsers = async (req, res, next) => {
  try {
    const roleUsers = await RoleUserService.findAllAssignments();
    res.status(200).json(roleUsers);
  } catch (error) {
    next(error);
  }
};

const getRoleUserById = async (req, res, next) => {
  try {
    const idRoleUser = req.params.idRoleUser;
    const roleUser = await RoleUserService.findAssignmentById(idRoleUser);
    if (!roleUser) {
      return res.status(404).json({ message: 'RoleUser not found' });
    }
    res.status(200).json(roleUser);
  } catch (error) {
    next(error);
  }
};

const getRolesByUserId = async (req, res, next) => {
  try {
    const idUser = req.params.iduser;
    const roles = await RoleUserService.findRolesByUserId(idUser);
    res.status(200).json(roles);
  } catch (error) {
    next(error);
  }
};

const getUsersByRoleId = async (req, res, next) => {
  try {
    const idRole = req.params.idRole;
    const users = await RoleUserService.findUsersByRoleId(idRole);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const removeRoleAssignmentById = async (req, res, next) => {
  try {
    const idRoleUser = req.params.idRoleUser;
    const deleted = await RoleUserService.removeAssignmentById(idRoleUser);
    if (!deleted) {
      return res.status(404).json({ message: 'RoleUser not found' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const removeRoleFromUser = async (req, res, next) => {
  try {
    const { iduser, idRole } = req.params;
    const deleted = await RoleUserService.removeRoleFromUser(iduser, idRole);
    if (!deleted) {
      return res.status(404).json({ message: 'RoleUser not found' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { assignRoleToUser, getAllRoleUsers, getRoleUserById, getRolesByUserId, getUsersByRoleId, removeRoleAssignmentById, removeRoleFromUser };