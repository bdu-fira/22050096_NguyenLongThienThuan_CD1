const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Products = sequelize.define('Products', {
    product_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      description: 'Mã sản phẩm tự động tạo'
    },
    product_name: {
      type: DataTypes.STRING,
      allowNull: false,
      description: 'Tên sản phẩm'
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      description: 'Mã danh mục, liên kết với bảng Categories'
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      description: 'Giá bán niêm yết của sản phẩm'
    },
    stock_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      description: 'Số lượng tồn kho hiện tại'
    },
    available_for_sale: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      description: 'Trạng thái sản phẩm có thể bán'
    },
    description: {
      type: DataTypes.STRING,
      description: 'Mô tả chi tiết sản phẩm'
    }
  }, {
    tableName: 'Products',
    timestamps: true
  });

  Products.associate = (models) => {
    Products.belongsTo(models.Categories, {
      foreignKey: 'category_id',
      as: 'category'
    });

    Products.hasMany(models.OrderDetails, {
      foreignKey: 'product_id',
      as: 'orderDetails'
    });

    Products.belongsToMany(models.Promotions, {
      through: 'ProductPromotions',
      foreignKey: 'product_id',
      otherKey: 'promo_id',
      as: 'promotions'
    });
  };

  return Products;
};
