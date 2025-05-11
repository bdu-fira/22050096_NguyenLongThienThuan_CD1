const AuthService = require('../services/AuthService');

const register = async (req, res, next) => {
  try {
    const { email, password, address, phone_number } = req.body;
    console.log("alo");
    
    const user = await AuthService.registerUser({ email, password, address, phone_number });
    return res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const rp = await AuthService.loginUser(email, password);
    return res.status(200).json(rp);
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    await AuthService.handleForgotPassword(email);
    return res.status(200).json({ message: 'Reset password email sent.' });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    await AuthService.resetPassword();
    return res.status(200).json({ message: 'Password reset successfully.' });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = res.locals.user.iduser;
    await AuthService.changePassword(userId, oldPassword, newPassword);
    return res.status(200).json({ message: 'Password changed successfully.' });
  } catch (error) {
    next(error);
  }
};

const verifyToken = async (req, res, next) => {
  try {
    const user = res.locals.user;
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, forgotPassword, resetPassword, changePassword, verifyToken };