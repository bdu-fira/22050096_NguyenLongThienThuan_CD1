const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Customers = sequelize.define('Customers', {
    customer_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    iduser: {
      type: DataTypes.INTEGER
    },
    customer_type_id: {
      type: DataTypes.INTEGER
    },
    customer_name: {
      type: DataTypes.STRING
    },
    contact_person: {
      type: DataTypes.STRING
    },
    primary_email: {
      type: DataTypes.STRING
    },
    address: {
      type: DataTypes.STRING
    },
    tax_code: {
      type: DataTypes.STRING
    },
    discount_rate: {
      type: DataTypes.DECIMAL
    }
  }, {
    tableName: 'Customers',
    timestamps: true
  });
  Customers.associate = (models) => {
    Customers.belongsTo(models.CustomerTypes, {
      foreignKey: 'customer_type_id',
      as: 'customerType'
    });
    // Customers.belongsTo(models.Users, { // Assuming Users model is defined elsewhere
    //   foreignKey: 'iduser',
    //   as: 'user'
    // });
    Customers.hasMany(models.Orders, {
      foreignKey: 'customer_id',
      as: 'orders'
    });
  };
  return Customers;
};