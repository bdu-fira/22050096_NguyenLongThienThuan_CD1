const db = require('../models/index');

/**
 * Assigns a role to a user.
 * @param {object} data - An object containing idUser and idRole.
 * @returns {Promise<RoleUser>} - The newly created RoleUser record.
 */
const assignRole = async (data) => {
  try {
    const roleUser = await db.RoleUsers.create(data);
    return roleUser;
  } catch (error) {
    throw new Error(`Failed to assign role to user: ${error.message}`);
  }
};

/**
 * Retrieves all role assignments.
 * @returns {Promise<Array<RoleUser>>} - A list of all RoleUser records.
 */
const findAllAssignments = async () => {
  try {
    const roleUsers = await db.RoleUsers.findAll();
    return roleUsers;
  } catch (error) {
    throw new Error(`Failed to retrieve role assignments: ${error.message}`);
  }
};

/**
 * Retrieves a role assignment by its ID.
 * @param {number} idRoleUser - The ID of the RoleUser record to retrieve.
 * @returns {Promise<RoleUser>} - The RoleUser record with the given ID, or null if not found.
 */
const findAssignmentById = async (idRoleUser) => {
  try {
    const roleUser = await db.RoleUsers.findByPk(idRoleUser);
    return roleUser;
  } catch (error) {
    throw new Error(`Failed to retrieve role assignment: ${error.message}`);
  }
};

/**
 * Retrieves all roles for a given user ID.
 * @param {number} idUser - The ID of the user.
 * @returns {Promise<Array<RoleUser>>} - A list of RoleUser records for the given user.
 */
const findRolesByUserId = async (idUser) => {
  try {
    const roleUsers = await db.RoleUsers.findAll({
      where: { idUser: idUser },
      include: [{ model: db.Roles, as: 'Role' }], // Include the Roles model to get role details
    });
    return roleUsers;
  } catch (error) {
    throw new Error(`Failed to retrieve roles for user: ${error.message}`);
  }
};

/**
 * Retrieves all users for a given role ID.
 * @param {number} idRole - The ID of the role.
 * @returns {Promise<Array<RoleUser>>} - A list of RoleUser records for the given role.
 */
const findUsersByRoleId = async (idRole) => {
  try {
    const roleUsers = await db.RoleUsers.findAll({
      where: { idRole: idRole },
      include: [{ model: db.Users, as: 'User' }], // Include the Users model to get user details
    });
    return roleUsers;
  } catch (error) {
    throw new Error(`Failed to retrieve users for role: ${error.message}`);
  }
};

/**
 * Removes a role assignment by its ID.
 * @param {number} idRoleUser - The ID of the RoleUser record to remove.
 * @returns {Promise<number>} - The number of deleted RoleUser records (0 or 1).
 */
const removeAssignmentById = async (idRoleUser) => {
  try {
    const deletedCount = await db.RoleUsers.destroy({
      where: { idRoleUser: idRoleUser },
    });
    return deletedCount;
  } catch (error) {
    throw new Error(`Failed to remove role assignment: ${error.message}`);
  }
};

/**
 * Removes a specific role from a user.
 * @param {number} idUser - The ID of the user.
 * @param {number} idRole - The ID of the role.
 * @returns {Promise<number>} - The number of deleted RoleUser records (0 or 1).
 */
const removeRoleFromUser = async (idUser, idRole) => {
  try {
    const deletedCount = await db.RoleUsers.destroy({
      where: { idUser: idUser, idRole: idRole },
    });
    return deletedCount;
  } catch (error) {
    throw new Error(`Failed to remove role from user: ${error.message}`);
  }
};

module.exports = { assignRole, findAllAssignments, findAssignmentById, findRolesByUserId, findUsersByRoleId, removeAssignmentById, removeRoleFromUser };