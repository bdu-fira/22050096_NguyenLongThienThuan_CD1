const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const OrderDetails = sequelize.define('OrderDetails', {
    invoice_details_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    quantity: DataTypes.INTEGER,
    amount: DataTypes.DECIMAL(15, 2),
    discount: DataTypes.DECIMAL(15, 2),
    final_amount: DataTypes.DECIMAL(15, 2)
  }, {
    tableName: 'OrderDetails',
    timestamps: true,
  });

  OrderDetails.associate = (models) => {
    OrderDetails.belongsTo(models.Orders, {
      foreignKey: 'order_id',
      as: 'order'
    });
    OrderDetails.belongsTo(models.Products, {
      foreignKey: 'product_id',
      as: 'product'
    });
  };

  return OrderDetails;
};

