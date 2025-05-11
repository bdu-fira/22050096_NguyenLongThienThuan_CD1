import React from 'react';
import { Card, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import orderService from '../services/orderService';

const STATUS_FLOW = [
  'chờ báo giá',
  'chờ thanh toán',
  'chờ soạn đơn',
  'chờ đi đơn',
  'chờ giao hàng',
  'đã giao'
];

const OrderCard = ({ order, onStatusUpdated }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/order-detail/${order.order_id}`);
  };

  const handleStatusUpdate = async () => {
    const currentIndex = STATUS_FLOW.indexOf(order.order_status);
    const nextStatus = STATUS_FLOW[currentIndex + 1];

    if (!nextStatus) {
      message.warning('Đơn hàng đã ở trạng thái cuối cùng.');
      return;
    }

    try {
      await orderService.updateOrderStatus(order.order_id, nextStatus);
      message.success(`Đã cập nhật trạng thái: ${nextStatus}`);
      if (onStatusUpdated) onStatusUpdated(); // gọi callback reload nếu có
    } catch (error) {
      console.error(error);
      message.error('Lỗi khi cập nhật trạng thái');
    }
  };

  const currentIndex = STATUS_FLOW.indexOf(order.order_status);
  const nextStatus = STATUS_FLOW[currentIndex + 1];

  return (
    <Card
      title={`Đơn hàng #${order.order_id}`}
      onClick={handleCardClick}
      className="glassmorphism-card hover:shadow-lg transition duration-300"
      style={{ marginBottom: '16px' }}
      extra={
        nextStatus && (
          <Button type="primary" size="small" onClick={(e) => {
            e.stopPropagation(); // không cho click vào card khi bấm nút
            handleStatusUpdate();
          }}>
            Cập nhật sang: {nextStatus}
          </Button>
        )
      }
    >
      <p>Ngày đặt: {new Date(order.order_date).toLocaleDateString()}</p>
      <p>Tổng thanh toán: {parseFloat(order.final_amount).toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND'
      })}</p>
      <p>Trạng thái: {order.order_status}</p>
    </Card>
  );
};

export default OrderCard;
