const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Contract = sequelize.define('Contracts', {
    contract_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    contract_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    contract_status: {
      type: DataTypes.STRING,
      allowNull: false
    },
    final_amount: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    contract_details: {
      type: DataTypes.TEXT
    }
  }, {
    tableName: 'Contracts',
    timestamps: true
  });
  return Contract;
};