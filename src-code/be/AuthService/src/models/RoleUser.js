const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const RoleUser = sequelize.define('RoleUsers', {
    idRoleUser: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      description: 'Mã RoleUsers'
    },
    idUser: {
      type: DataTypes.INTEGER,
      allowNull: false,
      description: 'Liên kết với Users'
    },
    idRole: {
      type: DataTypes.INTEGER,
      allowNull: false,
      description: 'Liên kết với Roles'
    }
  }, {
    tableName: 'RoleUsers',
    timestamps: true // You can change it to true if you want timestamps
  });

  RoleUser.associate = (models) => {
    RoleUser.belongsTo(models.Users, {
      foreignKey: 'idUser',
      as: 'user'
    });
    RoleUser.belongsTo(models.Roles, {
      foreignKey: 'idRole',
      as: 'role'
    });
  };

  return RoleUser;
};
