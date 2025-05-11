const db = require('../models');
const ProductsService = require('./ProductsService');
const { CustomerTypes, Orders, OrderDetails, Customers, Employees, Products, Promotions, OrderPromotions } = db;

/**
 * Creates a new order.
 * @param {Object} data - Order data.
 * @param {Object} requestingUser - User object from res.locals.user.
 * @returns {Promise<Order>} - The created order.
 */
async function createOrder(data, requestingUser) {
  try {
    const { items, promo_ids, ...orderData } = data;

    const customer = await Customers.findOne({
      where: { iduser: requestingUser.iduser },
      include: [{ model: CustomerTypes, as: "customerType" }]
    });

    if (requestingUser.roles?.includes('Customer')) {
      if (!customer || customer.customer_id !== orderData.customer_id) {
        throw new Error('Unauthorized: Customers can only create orders for themselves.');
      }
    }

    const order = await Orders.create({
      ...orderData,
      order_date: new Date(),
      customer_id: orderData.customer_id || requestingUser.customer_id,
      order_status: 'chờ báo giá'
    });

    let totalAmount = 0;
    let totalDiscount = 0;
    const hasPromotion = Array.isArray(promo_ids) && promo_ids.length > 0;
    const cartProductIds = items.map(i => i.product_id);

    for (const item of items) {
      const product = await Products.findByPk(item.product_id);
      if (!product) throw new Error(`Product ID ${item.product_id} not found.`);

      const baseAmount = product.price * item.quantity;
      let itemDiscount = 0;
      const applicablePromos = [];

      if (hasPromotion) {
        for (const pid of promo_ids) {
          const promo = await Promotions.findByPk(pid, {
            include: ['promotionType', 'productPromotions']
          });
          if (!promo) continue;

          const isProductSpecific = promo.productPromotions?.some(pp => pp.product_id === item.product_id);
          const isGlobalPromo = !promo.productPromotions || promo.productPromotions.length === 0;

          if (isProductSpecific) {
            applicablePromos.push({ ...promo.toJSON(), scope: 'product' });
            await OrderPromotions.findOrCreate({ where: { order_id: order.order_id, promo_id: promo.promo_id } });
          } else if (isGlobalPromo) {
            applicablePromos.push({ ...promo.toJSON(), scope: 'order' });
          }
        }
      }

      for (const promo of applicablePromos.filter(p => p.scope === 'product')) {
        const { type } = promo.promotionType || {};
        const value = parseFloat(promo.discount_value);

        if (type === 'percent') {
          itemDiscount += baseAmount * value / 100;
        } else if (type === 'fixed_amount') {
          itemDiscount += Math.min(value, baseAmount);
        }
      }

      const finalAmount = baseAmount - itemDiscount;

      await OrderDetails.create({
        order_id: order.order_id,
        product_id: item.product_id,
        quantity: item.quantity,
        amount: baseAmount,
        discount: itemDiscount,
        final_amount: finalAmount
      });

      totalAmount += baseAmount;
      totalDiscount += itemDiscount;
    }

    if (hasPromotion) {
      for (const pid of promo_ids) {
        const promo = await Promotions.findByPk(pid, {
          include: ['promotionType', 'productPromotions']
        });

        if (!promo) continue;

        const type = promo.promotionType?.type;
        const productPromoIds = promo.productPromotions?.map(p => p.product_id) || [];
        const isGlobal = productPromoIds.length === 0 && type !== 'bundle';
        const isBundle = type === 'bundle' && productPromoIds.length > 0;

        let promoDiscount = 0;

        if (isGlobal) {
          if (type === 'percent') {
            promoDiscount = totalAmount * parseFloat(promo.discount_value) / 100;
          } else if (type === 'fixed_amount') {
            promoDiscount = Math.min(parseFloat(promo.discount_value), totalAmount);
          }
        }

        if (isBundle) {
          const hasAll = productPromoIds.every(pid => items.some(item => item.product_id === pid));
          if (hasAll) {
            promoDiscount = parseFloat(promo.discount_value);
          }
        }

        if (promoDiscount > 0) {
          totalDiscount += promoDiscount;
          await OrderPromotions.findOrCreate({ where: { order_id: order.order_id, promo_id: promo.promo_id } });
        }
      }
    }

    let customerTypeDiscount = 0;
    if (!hasPromotion && customer?.customerType?.rate_type) {
      const rate = parseFloat(customer.customerType.rate_type);
      if (!isNaN(rate) && rate > 0) {
        customerTypeDiscount = (totalAmount - totalDiscount) * rate / 100;
        totalDiscount += customerTypeDiscount;
      }
    }

    order.amount = totalAmount;
    order.discount_applied = totalDiscount;
    order.final_amount = totalAmount - totalDiscount;
    await order.save();

    return order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

async function updateOrder(id, data, requestingUser) {
  try {
    const order = await Orders.findByPk(id, {
      include: [
        { model: OrderDetails, as: 'orderDetails' },
        { model: Promotions, as: 'promotions' }
      ]
    });
    if (!order) throw new Error('Đơn hàng không tồn tại');

    if (!requestingUser.roles?.some((r) => ['Employee', 'Admin'].includes(r))) {
      throw new Error('Không có quyền cập nhật đơn hàng.');
    }

    const customer = await Customers.findOne({
      where: { customer_id: order.customer_id },
      include: [{ model: CustomerTypes, as: 'customerType' }]
    });

    const { items, promo_ids = [], ...orderData } = data;

    const existingDetailMap = new Map(order.orderDetails.map((od) => [od.product_id, od]));
    const newProductIds = items.map((i) => i.product_id);

    for (const productId of existingDetailMap.keys()) {
      if (!newProductIds.includes(productId)) {
        await OrderDetails.destroy({ where: { order_id: id, product_id: productId } });
      }
    }

    let totalAmount = 0;
    let totalDiscount = 0;
    const usedPromoIds = new Set(); // ✅ Lưu mã đã dùng cho product

    const productMap = new Map();
    for (const item of items) {
      productMap.set(item.product_id, item.quantity);
    }

    for (const item of items) {
      const product = await Products.findByPk(item.product_id);
      if (!product) throw new Error(`Không tìm thấy sản phẩm ${item.product_id}`);

      const baseAmount = product.price * item.quantity;
      let itemDiscount = 0;

      for (const pid of promo_ids) {
        const promo = await Promotions.findByPk(pid, {
          include: ['promotionType', 'productPromotions']
        });
        if (!promo) continue;

        const type = promo.promotionType?.type;
        const isBundle = type === 'bundle';
        const isProductPromo = promo.productPromotions?.some(p => p.product_id === item.product_id);

        if (isProductPromo && !isBundle) {
          const value = parseFloat(promo.discount_value);
          if (type === 'percent') {
            itemDiscount += baseAmount * value / 100;
          } else if (type === 'fixed_amount') {
            itemDiscount += Math.min(value, baseAmount);
          }

          usedPromoIds.add(promo.promo_id); // ✅ Ghi nhận đã dùng
        }
      }

      const finalAmount = baseAmount - itemDiscount;

      const existing = await OrderDetails.findOne({
        where: { order_id: id, product_id: item.product_id }
      });

      if (existing) {
        await existing.update({
          quantity: item.quantity,
          amount: baseAmount,
          discount: itemDiscount,
          final_amount: finalAmount
        });
      } else {
        await OrderDetails.create({
          order_id: id,
          product_id: item.product_id,
          quantity: item.quantity,
          amount: baseAmount,
          discount: itemDiscount,
          final_amount: finalAmount
        });
      }

      totalAmount += baseAmount;
      totalDiscount += itemDiscount;
    }

    await OrderPromotions.destroy({ where: { order_id: id } });

    let hasDiscountFromPromo = usedPromoIds.size > 0;

    for (const pid of promo_ids) {
      if (usedPromoIds.has(pid)) continue; // ✅ Đã tính cho product rồi

      const promo = await Promotions.findByPk(pid, {
        include: ['promotionType', 'productPromotions']
      });
      if (!promo) continue;

      const type = promo.promotionType?.type;
      const value = parseFloat(promo.discount_value);
      const productPromoIds = promo.productPromotions?.map(p => p.product_id) || [];

      let promoDiscount = 0;

      if (type === 'bundle') {
        const hasAll = productPromoIds.every(pid => productMap.has(pid));
        if (hasAll) {
          promoDiscount += value;
          hasDiscountFromPromo = true;
        }
      } else if (productPromoIds.length === 0) {
        if (type === 'percent') {
          promoDiscount += totalAmount * value / 100;
        } else if (type === 'fixed_amount') {
          promoDiscount += Math.min(value, totalAmount);
        }
        hasDiscountFromPromo = true;
      }

      if (promoDiscount > 0) {
        totalDiscount += promoDiscount;
        usedPromoIds.add(promo.promo_id); // cũng đánh dấu là đã dùng
      }
    }

    for (const promo_id of usedPromoIds) {
      await OrderPromotions.findOrCreate({
        where: { order_id: id, promo_id }
      });
    }

    // Chỉ áp dụng chiết khấu loại KH nếu không có mã nào giảm
    let customerTypeDiscount = 0;
    if (!hasDiscountFromPromo && customer?.customerType?.rate_type) {
      const rate = parseFloat(customer.customerType.rate_type);
      if (!isNaN(rate) && rate > 0) {
        customerTypeDiscount = (totalAmount - totalDiscount) * rate / 100;
        totalDiscount += customerTypeDiscount;
      }
    }

    await order.update({
      ...orderData,
      amount: totalAmount,
      discount_applied: totalDiscount,
      final_amount: totalAmount - totalDiscount,
      order_status: 'chờ thanh toán',
      sales_representative: requestingUser.employee_id || null
    });
    await order.reload({
      include: [
        {
          model: Customers,
          as: 'customer',
          include: [
            {
              model: CustomerTypes,
              as: 'customerType'
            }
          ]
        },
        {
          model: OrderDetails,
          as: 'orderDetails',
          include: [
            {
              model: Products,
              as: 'product'
            }
          ]
        },
        {
          model: Promotions,
          as: 'promotions',
          through: { attributes: [] }
        },
        {
          model: Employees,
          as: 'salesRep',
          attributes: ['staff_name']
        }
      ]
    });
    return order;
  } catch (error) {
    console.error('❌ Lỗi khi cập nhật đơn hàng:', error);
    throw error;
  }
}



/**
 * Retrieves all orders based on user role.
 * @param {Object} options - Query options.
 * @param {Object} requestingUser - User object from res.locals.user.
 * @returns {Promise<Array<Order>>} - List of orders.
 */
async function getAllOrders(options = {}, requestingUser) {
  try {

    // Nếu là Customer: chỉ hiển thị đơn của chính mình
    if(!requestingUser.roles?.includes('Employee')){
      if (requestingUser.roles?.includes('Customer')) {
        const customer = await Customers.findOne({
          where: { iduser: requestingUser.iduser },
        });
        if (!customer) {
          return []; // hoặc throw new Error('Không tìm thấy hồ sơ khách hàng');
        }
  
        options.where = {
          ...options.where,
          customer_id: customer.customer_id,
        };
      }
    }

    // Include đầy đủ chi tiết hóa đơn + sản phẩm + mã khuyến mãi
    options.include = [
      {
        model: Customers,
        as: "customer",
        include: [{
          model: CustomerTypes,
          as: "customerType"
        }]
      },
      {
        model: OrderDetails,
        as: 'orderDetails',
        include: [
          {
            model: Products,
            as: 'product',
          },
        ],
      },
      {
        model: Promotions,
        as: 'promotions',
        through: { attributes: [] }, // bỏ thông tin trung gian OrderPromotions
      },
      {
        model: Employees,
        as: 'salesRep',
        attributes: ["staff_name"]
      }
    ];

    const orders = await Orders.findAll(options);
    return orders;
  } catch (error) {
    console.error('❌ Lỗi khi lấy danh sách đơn hàng:', error);
    throw error;
  }
}



/**
 * Retrieves an order by ID.
 * @param {Number} id - Order ID.
 * @param {Object} requestingUser - User object from res.locals.user.
 * @returns {Promise<Order>} - The order.
 */
async function getOrderById(id, requestingUser) {
  try {
    const order = await Orders.findByPk(id, {
      include: [
        {
          model: OrderDetails,
          as: 'orderDetails',
          include: [
            {
              model: Products,
              as: 'product'
            }
          ]
        },
        {
          model: Promotions,
          as: 'promotions'
        },
        {
          model: Customers,
          as: 'customer',
          include: [{ model: CustomerTypes, as: "customerType" }]
        },
        {
          model: Employees,
          as: 'salesRep',
          attributes: ["staff_name"]
        }
      ]
    });

    if (!order) {
      return null;
    }

    // Nếu là khách hàng, chỉ được xem đơn hàng của chính mình
    if(!requestingUser.roles?.includes('Employee') && !requestingUser.roles?.includes('Admin')){
       if (requestingUser.roles?.includes('Customer')) {
      const customer = await Customers.findOne({ where: { iduser: requestingUser.iduser } });
      if (!customer || order.customer_id !== customer.customer_id) {
        return null; // hoặc throw new Error('Không có quyền truy cập đơn hàng này.');
      }
    }
    }

    return order;
  } catch (error) {
    console.error('Error getting order by ID:', error);
    throw error;
  }
}


/**
 * Retrieves orders by customer ID.
 * @param {Number} customerId - Customer ID.
 * @param {Object} requestingUser - User object from res.locals.user.
 * @returns {Promise<Array<Order>>} - List of orders.
 */
async function getOrdersByCustomerId(customerId, requestingUser) {
  try {
    // Authorization: Customer can only view their own orders


    const orders = await Orders.findAll({
      where: { customer_id: requestingUser.customer_id },
      include: [{ model: OrderDetails, as: "orderDetails" }
        , {
        model: Customers,
        as: "customer",
        include: [{
          model: CustomerTypes,
          as: "customerType"
        }]
      }
      ]
    });
    return orders;
  } catch (error) {
    console.error('Error getting orders by customer ID:', error);
    throw error;
  }
}

/**
 * Retrieves orders by sales representative ID.
 * @param {Number} salesRepId - Sales representative ID.
 * @returns {Promise<Array<Order>>} - List of orders.
 */
async function getOrdersBySalesRepId(salesRepId) {
  try {
    const orders = await Orders.findAll({ where: { sales_representative: salesRepId } });
    return orders;
  } catch (error) {
    console.error('Error getting orders by sales rep ID:', error);
    throw error;
  }
}








/**
 * Updates the status of an order.
 * @param {Number} id - Order ID.
 * @param {String} status - New order status.
 * @param {Object} requestingUser - User object from res.locals.user.
 * @returns {Promise<Order>} - The updated order.
 */
async function updateOrderStatus(id, status, requestingUser) {
  try {
    const VALID_STATUSES = [
      'chờ báo giá',
      'chờ thanh toán',
      'chờ soạn đơn',
      'chờ đi đơn',
      'chờ giao hàng',
      'đã giao'
    ];

    if (!VALID_STATUSES.includes(status)) {
      throw new Error(`Invalid order status: ${status}`);
    }

    const order = await Orders.findByPk(id);
    if (!order) {
      throw new Error('Order not found');
    }

    // Kiểm tra quyền
    const roles = requestingUser.roles || [];
    if (!roles.includes('Employee') && !roles.includes('Admin')) {
      throw new Error('Unauthorized: Only Employee or Admin can update order status.');
    }

    const fromStatus = order.order_status;
    const toStatus = status;

    // Trừ kho khi chuyển sang "chờ đi đơn"
    const shouldDeduct = fromStatus !== 'chờ đi đơn' && toStatus === 'chờ đi đơn';

    // Cộng lại kho nếu quay ngược từ "chờ đi đơn" về trạng thái trước
    const shouldRestock = fromStatus === 'chờ đi đơn' && toStatus !== 'chờ đi đơn';

    if (shouldDeduct || shouldRestock) {
      const orderDetails = await OrderDetails.findAll({ where: { order_id: id } });

      for (const detail of orderDetails) {
        const delta = shouldDeduct ? -detail.quantity : detail.quantity;
        // await ProductsService.updateStockQuantity(detail.product_id, delta);
      }
    }

    // Cập nhật trạng thái đơn hàng
    order.order_status = toStatus;
    await order.save();

    return order;
  } catch (error) {
    console.error('Error updating order status:', error.message);
    throw error;
  }
}




/**
 * Deletes an order.
 * @param {Number} id - Order ID.
 * @param {Object} requestingUser - User object from res.locals.user.
 * @returns {Promise<Boolean>} - True if deleted, false otherwise.
 */
async function deleteOrder(id, requestingUser) {
  try {
    const order = await Orders.findByPk(id);

    if (!order) {
      return false;
    }

    // Authorization: Customer can only delete their own orders
    if (requestingUser.roles && requestingUser.roles.includes('Customer')) {
      const customer = await Customers.findOne({ where: { iduser: requestingUser.iduser } });
      if (!customer || order.customer_id !== customer.customer_id) {
        throw new Error('Unauthorized: Customer can only delete their own orders.');
      }
    }

    const deletedRows = await Orders.destroy({ where: { order_id: id } });
    return deletedRows > 0;
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
}

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByCustomerId,
  getOrdersBySalesRepId,
  updateOrder,
  updateOrderStatus,
  deleteOrder
};
