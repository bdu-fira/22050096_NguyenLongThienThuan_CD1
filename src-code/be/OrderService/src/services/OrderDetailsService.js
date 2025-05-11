const db = require('../models');
const { OrderDetails, Products, Orders } = db;

/**
 * Creates a new order detail.
 * @param {Object} data - Order detail data.
 * @returns {Promise<OrderDetail>} - The created order detail.
 */
async function createOrderDetail(data) {
  try {
    const orderDetail = await OrderDetails.create(data);
    return orderDetail;
  } catch (error) {
    console.error('Error creating order detail:', error);
    throw error;
  }
}

/**
 * Retrieves an order detail by ID.
 * @param {Number} id - Order detail ID.
 * @returns {Promise<OrderDetail>} - The order detail.
 */
async function getOrderDetailById(id) {
  try {
    const orderDetail = await OrderDetails.findByPk(id);
    return orderDetail;
  } catch (error) {
    console.error('Error getting order detail by ID:', error);
    throw error;
  }
}

/**
 * Updates an existing order detail.
 * @param {Number} id - Order detail ID.
 * @param {Object} data - Order detail data to update.
 * @returns {Promise<OrderDetail>} - The updated order detail.
 */
async function updateOrderDetail(id, data) {
  try {
    const orderDetail = await OrderDetails.findByPk(id);

    if (!orderDetail) {
      return null;
    }

    await orderDetail.update(data);
    return orderDetail;
  } catch (error) {
    console.error('Error updating order detail:', error);
    throw error;
  }
}

/**
 * Deletes an order detail.
 * @param {Number} id - Order detail ID.
 * @returns {Promise<Boolean>} - True if deleted, false otherwise.
 */
async function deleteOrderDetail(id) {
  try {
    const deletedRows = await OrderDetails.destroy({ where: { invoice_details_id: id } });
    return deletedRows > 0;
  } catch (error) {
    console.error('Error deleting order detail:', error);
    throw error;
  }
}

module.exports = {
  createOrderDetail,
  getOrderDetailById,
  updateOrderDetail,
  deleteOrderDetail
};
