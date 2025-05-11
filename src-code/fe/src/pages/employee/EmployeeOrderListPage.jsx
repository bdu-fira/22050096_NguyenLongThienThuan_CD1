import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployeeOrders, updateOrderStatus } from '../../redux/slices/orderSlice';
import { Row, Col, Spin, Card, Tag, Button, message } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const formatCurrency = (amount) =>
  parseFloat(amount).toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });

const STATUS_FLOW = [
  'chờ báo giá',
  'chờ thanh toán',
  'chờ soạn đơn',
  'chờ đi đơn',
  'chờ giao hàng',
  'đã giao'
];
const STATUS_ACTION_LABELS = {
  'chờ báo giá': 'kiểm tra đơn hàng',
  'chờ thanh toán': 'Đã thanh toán',
  'chờ soạn đơn': 'Đã soạn đơn',
  'chờ đi đơn': 'Đã đi đơn',
  'chờ giao hàng': 'Đã giao hàng'
};

const EmployeeOrderListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, loading, error } = useSelector((state) => state.order);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const statusFilter = queryParams.get('status');

  const reloadOrders = useCallback(() => {
    dispatch(fetchEmployeeOrders());
  }, [dispatch]);

  useEffect(() => {
    reloadOrders();
  }, [reloadOrders]);

  const filteredOrders = statusFilter
    ? orders.filter((order) => order.order_status === statusFilter)
    : orders;

    const handleUpdateStatus = async (order) => {
      if (order.order_status === 'chờ báo giá') {
        navigate(`/employee/order-detail/${order.order_id}`);
        return;
      }
    
      const currentIndex = STATUS_FLOW.indexOf(order.order_status);
      const nextStatus = STATUS_FLOW[currentIndex + 1];
    
      if (!nextStatus) {
        message.warning('Đơn hàng đã ở trạng thái cuối cùng.');
        return;
      }
    
      try {
        dispatch(updateOrderStatus({ id: order.order_id, status: nextStatus }));
        message.success(`Đã cập nhật trạng thái sang: ${nextStatus}`);
        reloadOrders(); // refresh lại list sau khi cập nhật
      } catch (error) {
        console.error(error);
        message.error('Cập nhật trạng thái thất bại!');
      }
    };
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800">
        Danh sách đơn hàng {statusFilter ? `- ${statusFilter}` : ''}
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <Spin size="large" />
        </div>
      ) : error ? (
        <p className="text-red-500">Lỗi: {error}</p>
      ) : filteredOrders && filteredOrders.length > 0 ? (
        <Row gutter={[16, 16]}>
          {filteredOrders.map((order) => {
            const currentIndex = STATUS_FLOW.indexOf(order.order_status);
            const nextStatus = STATUS_FLOW[currentIndex + 1];

            return (
              <Col key={order.order_id} xs={24} sm={12} md={12} lg={8} xl={6}>
                <Card
                  title={`Đơn hàng #${order.order_id}`}
                  bordered
                  className="bg-white/10 border border-white/30 rounded-xl hover:shadow-xl"
                  hoverable
                >
                  <Tag color="blue" className="mb-2">{order.order_status || 'Chưa cập nhật'}</Tag>

                  <p><strong>Khách hàng:</strong> {order.customer?.customer_name || order.customer_id}</p>
                  <p><strong>Loại khách:</strong> {order.customer?.customerType?.name || 'N/A'}</p>
                  <p><strong>Ngày đặt:</strong> {new Date(order.order_date).toLocaleString()}</p>
                  <p><strong>Nhân viên:</strong> {order.salesRep?.staff_name || 'Chưa có'}</p>
                  <p><strong>Tổng tiền hàng:</strong> {formatCurrency(order.amount)}</p>
                  <p><strong>Chiết khấu:</strong> {formatCurrency(order.discount_applied)}</p>
                  <p><strong>Thanh toán:</strong> {formatCurrency(order.final_amount)}</p>

                  {order.promotions?.length > 0 && (
                    <div className="mt-1">
                      <strong>Khuyến mãi:</strong>
                      <div className="mt-1">
                        {order.promotions.map((promo) => (
                          <Tag key={promo.promo_id} color="green">{promo.promo_name}</Tag>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Nút cập nhật trạng thái – đẹp và tinh tế */}
                  {nextStatus && (
                    <div className="text-center mt-4">
                      <Button
                        type="primary"
                        onClick={() => handleUpdateStatus(order)}
                        className="rounded-full px-6 shadow-sm"
                      >
                        {STATUS_ACTION_LABELS[order.order_status] || `Cập nhật: ${nextStatus}`}
                      </Button>
                    </div>
                  )}
                </Card>

              </Col>
            );
          })}
        </Row>
      ) : (
        <p>Không có đơn hàng nào.</p>
      )}
    </div>
  );
};

export default EmployeeOrderListPage;
