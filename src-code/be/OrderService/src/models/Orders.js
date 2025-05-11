const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Orders = sequelize.define('Orders', {
    order_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      description: 'Mã đơn hàng tự động tạo'
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      description: 'Mã khách hàng'
    },
    order_date: {
      type: DataTypes.DATE,
      allowNull: false,
      description: 'Ngày đặt hàng'
    },
    sales_representative: {
      type: DataTypes.INTEGER,
      description: 'Mã nhân viên phụ trách'
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2), 
      description: 'Tổng tiền trước chiết khấu cho toàn đơn hàng'
    },
    discount_applied: {
      type: DataTypes.DECIMAL(15, 2),
      description: 'Tổng chiết khấu đã áp dụng'
    },
    final_amount: {
      type: DataTypes.DECIMAL(15, 2),
      description: 'Tổng giá trị đơn hàng sau chiết khấu'
    },
    
    order_status: {
      type: DataTypes.ENUM(
        'chờ báo giá',
        'chờ thanh toán',
        'chờ soạn đơn',
        'chờ đi đơn',
        'chờ giao hàng',
        'đã giao'
      ),
      allowNull: false,
      defaultValue: 'chờ báo giá',
      description: 'Trạng thái đơn hàng'
    }
    
    
  },
  {
    tableName: 'Orders',
    timestamps: true,
    underscored: true // Sử dụng underscored thay vì camelCase
  });

  Orders.associate = (models) => {
    Orders.belongsTo(models.Customers, {
      foreignKey: 'customer_id',
      as: 'customer'
    });
    Orders.belongsTo(models.Employees, {
      foreignKey: 'sales_representative',
      as: 'salesRep'
    });
    Orders.hasMany(models.OrderDetails, {
      foreignKey: 'order_id',
      as: 'orderDetails'
    });
    Orders.belongsToMany(models.Promotions, {
      through: 'OrderPromotions',
      foreignKey: 'order_id',
      otherKey: 'promo_id',
      as: 'promotions'
    });

    //Orders.hasOne(models.Contracts, {
    //  foreignKey: 'order_id',
    //  as: 'contract'
    //});
  };

  return Orders;
};
