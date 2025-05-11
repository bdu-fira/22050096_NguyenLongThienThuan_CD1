const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Promotions = sequelize.define('Promotions', {
    promo_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      description: 'Mã chương trình khuyến mãi tự động'
    },
    promo_name: {
      type: DataTypes.STRING,
      allowNull: false,
      description: 'Tên chương trình khuyến mãi'
    },
    promotion_details_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      description: 'Liên kết với PromotionTypes'
    },
    discount_value: {
      type: DataTypes.DECIMAL(10, 2),
      description: 'Giá trị giảm (theo % hoặc tiền)'
    },
    start_date: {
      type: DataTypes.DATE,
      description: 'Ngày bắt đầu'
    },
    end_date: {
      type: DataTypes.DATE,
      description: 'Ngày kết thúc'
    },
    promo_code: {
      type: DataTypes.STRING,
      description: 'Mã khuyến mãi'
    }
  },
  {
    tableName: 'Promotions',
    timestamps: true
  });

  Promotions.associate = (models) => {
    Promotions.belongsTo(models.PromotionTypes, {
      foreignKey: 'promotion_details_id',
      as: 'promotionType'
    });

    Promotions.belongsToMany(models.Products, {
      through: 'ProductPromotions',
      foreignKey: 'promo_id',
      otherKey: 'product_id',
      as: 'productPromotions' // ✅ đúng
    });

    Promotions.belongsToMany(models.Orders, {
      through: 'OrderPromotions',
      foreignKey: 'promo_id',
      otherKey: 'order_id',
      as: 'orders'
    });
  };

  return Promotions;
};
