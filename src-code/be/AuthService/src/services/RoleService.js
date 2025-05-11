const db = require('../models/index');

/**
 * Creates a new role.
 * @param {object} roleData - The data for the new role.
 * @returns {Promise<Role>} - The newly created role.
 */
const createRole = async (roleData) => {
  try {
    const role = await db.Roles.create(roleData);
    return role;
  } catch (error) {
    throw new Error(`Failed to create role: ${error.message}`);
  }
};

/**
 * Retrieves all roles.
 * @returns {Promise<Array<Role>>} - A list of all roles.
 */
const findAllRoles = async () => {
  try {
    const roles = await db.Roles.findAll();
    return roles;
  } catch (error) {
    throw new Error(`Failed to retrieve roles: ${error.message}`);
  }
};

/**
 * Retrieves a role by its ID.
 * @param {number} idRole - The ID of the role to retrieve.
 * @returns {Promise<Role>} - The role with the given ID, or null if not found.
 */
const findRoleById = async (idRole) => {
  try {
    const role = await db.Roles.findByPk(idRole);
    return role;
  } catch (error) {
    throw new Error(`Failed to retrieve role: ${error.message}`);
  }
};

/**
 * Updates a role.
 * @param {number} idRole - The ID of the role to update.
 * @param {object} roleData - The data to update the role with.
 * @returns {Promise<Array<number>>} - An array containing the number of affected rows.
 */
const updateRole = async (idRole, roleData) => {
  try {
    const [affectedRows] = await db.Roles.update(roleData, {
      where: { idRole: idRole },
    });
    return [affectedRows];
  } catch (error) {
    throw new Error(`Failed to update role: ${error.message}`);
  }
};

/**
 * Deletes a role.
 * Before deleting, it checks and removes any associated entries in RoleUsers.
 * @param {number} idRole - The ID of the role to delete.
 * @returns {Promise<number>} - The number of deleted roles (0 or 1).
 */
const deleteRole = async (idRole) => {
  try {
    // Remove associated entries in RoleUsers
    await db.RoleUsers.destroy({
      where: { idRole: idRole },
    });

    // Delete the role
    const deletedRoleCount = await db.Roles.destroy({
      where: { idRole: idRole },
    });
    return deletedRoleCount;
  } catch (error) {
    throw new Error(`Failed to delete role: ${error.message}`);
  }
};

module.exports = { createRole, findAllRoles, findRoleById, updateRole, deleteRole };