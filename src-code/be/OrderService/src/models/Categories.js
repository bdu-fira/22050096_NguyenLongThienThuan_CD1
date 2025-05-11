const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Categories = sequelize.define('Categories', {
    category_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      description: 'Mã danh mục sản phẩm'
    },
    category_name: {
      type: DataTypes.STRING,
      allowNull: false,
      description: 'Tên danh mục sản phẩm'
    }
  }, {
    tableName: 'Categories',
    timestamps: true
  });

  Categories.associate = (models) => {
    Categories.hasMany(models.Products, {
      foreignKey: 'category_id',
      as: 'products'
    });
  };

  return Categories;
};
