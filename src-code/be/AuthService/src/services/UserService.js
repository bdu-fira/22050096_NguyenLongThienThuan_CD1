const db = require('../models');

const createUser = async (userData) => {
  try {
    const user = await db.Users.create(userData);
    return user;
  } catch (error) {
    throw error;
  }
};

const findAllUsers = async (options = {}) => {
  try {
    const users = await db.Users.findAll({
      ...options,
      include: [{ model: db.RoleUsers, as: 'RoleUsers', include: [{ model: db.Roles, as: 'role' }] }]
    });
    return users;
  } catch (error) {
    throw error;
  }
};

const findUserById = async (iduser, requestingUser) => {
  try {
    let options = {
      include: [{ model: db.RoleUsers, as: 'RoleUsers', include: [{ model: db.Roles, as: 'role' }] }],
      where: { iduser: iduser }
    };

    // Example: Limit access to self or admin
    // if (requestingUser.roles.includes('Admin')) {
    //   // Admin can see all users, no need to modify options
    // } else if (requestingUser.iduser !== parseInt(iduser)) {
    //   throw new Error('Unauthorized'); // Or return null/undefined
    // }

    const user = await db.Users.findOne(options);
    return user;
  } catch (error) {
    throw error;
  }
};

const updateUser = async (iduser, userData, requestingUser) => {
  try {
    // Example: Limit access to self or admin
    // if (requestingUser.roles.includes('Admin')) {
    //   // Admin can update all users, no need to check iduser
    // } else if (requestingUser.iduser !== parseInt(iduser)) {
    //   throw new Error('Unauthorized'); // Or return null/undefined
    // }

    const user = await db.Users.update(userData, { where: { iduser: iduser } });
    return user;
  } catch (error) {
    throw error;
  }
};

const deleteUser = async (iduser, requestingUser) => {
  try {
    // Example: Limit access to admin
    // if (!requestingUser.roles.includes('Admin')) {
    //   throw new Error('Unauthorized');
    // }

    await db.Users.destroy({ where: { iduser: iduser } });
    return true;
  } catch (error) {
    throw error;
  }
};

module.exports = { createUser, findAllUsers, findUserById, updateUser, deleteUser };