const UserService = require('../services/UserService');

const createUser = async (req, res, next) => {
  try {
    const userData = req.body;
    const user = await UserService.createUser(userData);
    return res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await UserService.findAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { iduser } = req.params;
    const requestingUser = res.locals.user;
    const user = await UserService.findUserById(iduser, requestingUser);
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { iduser } = req.params;
    const userData = req.body;
    const requestingUser = res.locals.user;
    const updatedUser = await UserService.updateUser(iduser, userData, requestingUser);
    return res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { iduser } = req.params;
    await UserService.deleteUser(iduser);
    return res.status(204).send(); // No content
  } catch (error) {
    next(error);
  }
};

module.exports = { createUser, getAllUsers, getUserById, updateUser, deleteUser };