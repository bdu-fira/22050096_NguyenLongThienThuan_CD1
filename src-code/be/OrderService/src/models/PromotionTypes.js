const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PromotionTypes = sequelize.define('PromotionTypes', {
    promotion_details_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      description: 'Mã loại khuyến mãi'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      description: 'Tên loại khuyến mãi'
    },
    type: {
      type: DataTypes.STRING,
      description: 'Kiểu khuyến mãi (%, giảm tiền, tặng quà...)'
    }
  },
  {
    tableName: 'PromotionTypes',
    timestamps: true
  });

  PromotionTypes.associate = (models) => {
    PromotionTypes.hasMany(models.Promotions, {
      foreignKey: 'promotion_details_id',
      as: 'promotions'
    });
  };

  return PromotionTypes;
};
