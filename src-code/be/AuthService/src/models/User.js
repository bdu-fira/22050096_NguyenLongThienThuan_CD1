const { DataTypes } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('Users', {
    iduser: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      description: 'Mã định danh người dùng'
    },
    email: {
      type: DataTypes.STRING,
      description: 'Email đăng nhập và liên hệ'
    },
    password: {
      type: DataTypes.STRING,
      description: 'Mật khẩu'
    },
    address: {
      type: DataTypes.STRING,
      description: 'Địa chỉ người dùng'
    },
    phone_number: {
      type: DataTypes.STRING,
      description: 'Số điện thoại liên hệ'
    }
  }, {
    tableName: 'Users'
  });
  User.associate = (models) => {
    User.hasMany(models.RoleUsers, { foreignKey: 'idUser' });
  }
  return User;
};