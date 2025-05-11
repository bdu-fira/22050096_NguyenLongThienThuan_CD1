const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CustomerTypes = sequelize.define('CustomerTypes', {
    customer_type_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      description: 'Mã loại khách hàng'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      description: 'Tên loại khách hàng (Đại lý cấp 1, 2, 3, Cá nhân, Tổ chức...)'
    },
    rate_type: {
      type: DataTypes.DECIMAL(10, 2),
      description: 'Mức chiết khấu áp dụng cho loại khách hàng'
    }
  }, {
    tableName: 'CustomerTypes',
    timestamps: true // Bật các trường createdAt và updatedAt
  });

  CustomerTypes.associate = (models) => {
    CustomerTypes.hasMany(models.Customers, {
      foreignKey: 'customer_type_id',
      as: 'customers' // Tên alias cho association
    });
  };

  return CustomerTypes;
};