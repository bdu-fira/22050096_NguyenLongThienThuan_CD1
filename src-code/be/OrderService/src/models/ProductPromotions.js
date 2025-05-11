const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const ProductPromotions = sequelize.define('ProductPromotions', {
    product_promo_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      description: 'Mã định danh liên kết SP-KM'
    },
    promo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      description: 'Mã chương trình khuyến mãi'
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      description: 'Mã sản phẩm'
    }
  },
  {
    tableName: 'ProductPromotions',
    timestamps: true,
    underscored: true // Sử dụng underscored thay vì camelCase
  });

  ProductPromotions.associate = (models) => {
    ProductPromotions.belongsTo(models.Promotions, {
      foreignKey: 'promo_id',
      as: 'promotion'
    });
    ProductPromotions.belongsTo(models.Products, {
      foreignKey: 'product_id',
      as: 'product'
    });
  };

  return ProductPromotions;
};
