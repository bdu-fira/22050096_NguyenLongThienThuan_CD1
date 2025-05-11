const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Role = sequelize.define('Roles', {
    idRole: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      description: 'Mã vai trò'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      description: 'Tên vai trò'
    }
  }, {
    tableName: 'Roles',
    timestamps: false // You can change it to true if you want timestamps
  });

  Role.associate = (models) => {
    Role.hasMany(models.RoleUsers, { // Corrected relation name
      foreignKey: 'idRole',
      as: 'roleUsers'
    });
  };

  return Role;
};
