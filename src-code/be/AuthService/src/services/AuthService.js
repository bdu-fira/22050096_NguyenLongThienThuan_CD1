const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models');
const config = require('../config/config');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
// khởi tạo transporter (ví dụ dùng Gmail SMTP)
 const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: config.development.mail,       // email gửi đi
    pass: config.development.appPassword,   // mật khẩu ứng dụng (app password)
  },
});
const registerUser = async (userData) => {
  try {
    const { email, password, address, phone_number } = userData;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await db.Users.create({ email, password: hashedPassword, address, phone_number });

    // Get Customer role ID
    const customerRole = await db.Roles.findOne({ where: { name: 'Customer' } });

    if (!customerRole) {
      throw new Error('Customer role not found');
    }

    // Assign Customer role to user
    await db.RoleUsers.create({ idUser: user.iduser, idRole: customerRole.idRole });

    return user;
  } catch (error) {
    throw error;
  }
};

const loginUser = async (email, password) => {
  try {
    // Find user by email
    const user = await db.Users.findOne({ where: { email }, include: [{ model: db.RoleUsers, as: 'RoleUsers', include: [{ model: db.Roles, as: 'role' }] }] });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new Error('Invalid credentials');
    }

    // Create JWT payload
    const payload = {
      iduser: user.iduser,
      email: user.email,
      roles: user.RoleUsers.map(roleUser => roleUser.role.name)
    };

    // Generate JWT
    const token = jwt.sign(payload, "tht", { expiresIn: '12h' });
    delete user.password


    return { token, user: { ...user.toJSON(), roles: user.RoleUsers.map(roleUser => roleUser.role.name) } };
  } catch (error) {
    throw error;
  }
};

async function handleForgotPassword(email) {
  try {
   
    // 1. Tìm user
    const user = await db.Users.findOne({ where: { email } });
    if (!user) {
      throw new Error('Không tìm thấy người dùng với email này.');
    }

    // 2. Tạo mật khẩu ngẫu nhiên (16 ký tự hex)
    const newPassword = crypto.randomBytes(8).toString('hex');

    // 3. Hash mật khẩu
    const saltRounds = 10;
    const hashed = await bcrypt.hash(newPassword, saltRounds);

    // 4. Cập nhật database
    await user.update({ password: hashed });

    // 5. Gửi email
    const mailOptions = {
      from: `"${config.fromName}" <${config.emailUser}>`,
      to: email,
      subject: 'Mật khẩu mới của bạn',
      text: `
Chào ${user.name || ''},

Bạn vừa yêu cầu cấp lại mật khẩu. Mật khẩu mới của bạn là:

    ${newPassword}

Vui lòng đăng nhập và đổi lại mật khẩu ngay sau khi đăng nhập để đảm bảo an toàn.

Nếu bạn không thực hiện yêu cầu này, vui lòng liên hệ với bộ phận hỗ trợ.

Trân trọng,
${config.fromName}
      `,
    };
    await transporter.sendMail(mailOptions);

    return { success: true, message: 'Đã gửi mật khẩu mới tới email.' };
  } catch (err) {
    // bạn có thể tuỳ chỉnh log hoặc ném lỗi lên caller
    console.error('handleForgotPassword error:', err);
    throw err;
  }
}

const resetPassword = async (token, newPassword) => {
  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in database
    await db.Users.update({ password: hashedPassword }, { where: { email: decoded.email } });
  } catch (error) {
    throw error;
  }
};

const changePassword = async (iduser, oldPassword, newPassword) => {
  try {
    // Find user by ID
    const user = await db.Users.findByPk(iduser);

    if (!user) {
      throw new Error('User not found');
    }

    // Compare old password
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!passwordMatch) {
      throw new Error('Invalid old password');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in database
    await user.update({ password: hashedPassword });
  } catch (error) {
    throw error;
  }
};

module.exports = { registerUser, loginUser, handleForgotPassword, resetPassword, changePassword };