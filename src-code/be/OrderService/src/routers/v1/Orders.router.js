const express = require('express');
const router = express.Router();
const OrdersController = require('../../controllers/OrdersController');
const { authenticate, requireRole } = require('../../middlewares/auth');
const { validate } = require('../../middlewares/validation');
const db = require('../../models');
const { sendCreateContractEvent } = require('../../kafka/producer');
let{Orders}=db;
// Route to create a new order
router.post('/', authenticate, requireRole(['Customer', 'Employee', 'Admin']), OrdersController.create);

// Route to get all orders (Admin/Employee only)
router.get('/', authenticate, requireRole(['Employee', 'Admin']), OrdersController.findAll);

// Route to get a specific order by ID
router.get('/:id', authenticate, OrdersController.findOne);

// Route to get orders by customer ID
router.get('/customer/:customerId', authenticate, OrdersController.findByCustomer);

// Route to get orders by sales representative ID
router.get('/salesrep/:salesRepId', authenticate, OrdersController.findBySalesRep);

// Route to update an existing order
router.put('/:id', authenticate, OrdersController.update);

// Route to update the status of an order (Admin/Employee only)
router.patch('/:id/status', authenticate, requireRole(['Employee', 'Admin']), OrdersController.updateStatus);

// Route to delete an order
router.delete('/:id', authenticate, OrdersController.remove);
const formatCurrency = (value) => parseFloat(value).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  
  router.post('/contract/:id', authenticate, async (req, res) => {
    try {
      const order = await Orders.findByPk(req.params.id, {
        include: [
          { association: 'customer' },
          {
            association: 'orderDetails',
            include: [{ association: 'product' }]
          }
        ],
      });
      await order.update({order_status:"chờ soạn đơn"})
      if (!order) return res.status(404).json({ message: 'Order not found' });
  
      // Tạo contract_details từ từng sản phẩm
      const contractLines = order.orderDetails.map((item, index) => {
        const productName = item.product?.product_name || `Sản phẩm ${item.product_id}`;
        const quantity = item.quantity;
        const unitPrice = formatCurrency(item.amount);
        const discount = formatCurrency(item.discount);
        const final = formatCurrency(item.final_amount);
  
        return `${index + 1}. ${productName} - SL: ${quantity}, Giá gốc: ${unitPrice}, Chiết khấu: ${discount}, Thành tiền: ${final}`;
      }).join('\n');
  
      const contractDetails = `
  Khách hàng: ${order.customer?.customer_name || 'N/A'}.
  Email: ${order.customer?.primary_email || 'N/A'}.
  Địa chỉ: ${order.customer?.address || 'N/A'}.
  Sản phẩm trong đơn hàng:
  ${contractLines}
  Tổng thanh toán: ${formatCurrency(order.final_amount)}
      `.trim();
  
      await sendCreateContractEvent({
        order_id: order.order_id,
        contract_date: new Date(),
        contract_status: 'created',
        final_amount: order.final_amount,
        contract_details: contractDetails
      });
  
      res.json({ message: 'Yêu cầu tạo hợp đồng đã gửi thành công!' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Lỗi server' });
    }
  });
  
module.exports = router;