const { OrderPromotions, Orders, Promotions } = require('../models/index');

/**
 * Liên kết một chương trình khuyến mãi với một đơn hàng.
 * @param {Number} orderId Mã đơn hàng.
 * @param {Number} promoId Mã chương trình khuyến mãi.
 * @returns {Promise<OrderPromotions>} Đối tượng OrderPromotions vừa được tạo.
 */
const linkPromotionToOrder = async (orderId, promoId) => {
  try {
    const order = await Orders.findByPk(orderId);
    const promotion = await Promotions.findByPk(promoId);

    if (!order) {
      throw new Error(`Không tìm thấy đơn hàng với ID: ${orderId}`);
    }

    if (!promotion) {
      throw new Error(`Không tìm thấy chương trình khuyến mãi với ID: ${promoId}`);
    }

    const orderPromotion = await OrderPromotions.create({
      order_id: orderId,
      promo_id: promoId,
    });

    return orderPromotion;
  } catch (error) {
    console.error('Lỗi khi liên kết khuyến mãi với đơn hàng:', error);
    throw error;
  }
};

/**
 * Gỡ bỏ liên kết giữa một chương trình khuyến mãi và một đơn hàng.
 * @param {Number} orderId Mã đơn hàng.
 * @param {Number} promoId Mã chương trình khuyến mãi.
 * @returns {Promise<Number>} Số lượng bản ghi đã bị xóa (0 hoặc 1).
 */
const unlinkPromotionFromOrder = async (orderId, promoId) => {
  try {
    const rowsDeleted = await OrderPromotions.destroy({
      where: {
        order_id: orderId,
        promo_id: promoId,
      },
    });

    return rowsDeleted;
  } catch (error) {
    console.error('Lỗi khi gỡ bỏ liên kết khuyến mãi khỏi đơn hàng:', error);
    throw error;
  }
};

/**
 * Tìm tất cả các chương trình khuyến mãi được áp dụng cho một đơn hàng cụ thể.
 * @param {Number} orderId Mã đơn hàng.
 * @returns {Promise<Array<Promotions>>} Mảng các đối tượng Promotions.
 */
const findPromotionsByOrderId = async (orderId) => {
  try {
    const order = await Orders.findByPk(orderId);

    if (!order) {
      throw new Error(`Không tìm thấy đơn hàng với ID: ${orderId}`);
    }

    const orderPromotions = await OrderPromotions.findAll({
      where: {
        order_id: orderId,
      },
      include: [{
        model: Promotions,
        as: 'Promotion'
      }]
    });

    // Extract the Promotions from the OrderPromotions
    const promotions = orderPromotions.map(op => op.Promotion);

    return promotions;

  } catch (error) {
    console.error('Lỗi khi tìm khuyến mãi theo ID đơn hàng:', error);
    throw error;
  }
};

module.exports = {
  linkPromotionToOrder,
  unlinkPromotionFromOrder,
  findPromotionsByOrderId
};
