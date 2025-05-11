const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const OrderPromotions = sequelize.define('OrderPromotions', {
    order_promotion_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    promo_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'OrderPromotions',
    timestamps: true,
  });

  OrderPromotions.associate = (models) => {
    OrderPromotions.belongsTo(models.Orders, {
      foreignKey: 'order_id',
      as: 'order'
    });
    OrderPromotions.belongsTo(models.Promotions, {
      foreignKey: 'promo_id',
      as: 'promotion'
    });
  };

  return OrderPromotions;
};
