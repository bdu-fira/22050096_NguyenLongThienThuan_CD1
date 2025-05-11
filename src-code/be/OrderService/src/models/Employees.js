const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Employees = sequelize.define('Employees', {
    staff_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    iduser: {
      type: DataTypes.INTEGER
    },
    staff_name: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    phone_number: {
      type: DataTypes.STRING
    },
    address: {
      type: DataTypes.STRING
    }
  }, {
    tableName: 'Employees',
    timestamps: true
  });
  Employees.associate = (models) => {
    // Employees.belongsTo(models.Users, { // Assuming Users model is defined elsewhere
    //   foreignKey: 'iduser',
    //   as: 'user'
    // });
    Employees.hasMany(models.Orders, {
      foreignKey: 'sales_representative',
      as: 'orders'
    });
  };
  return Employees;
};