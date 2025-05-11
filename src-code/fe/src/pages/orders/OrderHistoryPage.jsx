import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomerOrders } from '../../redux/slices/orderSlice';
import { Layout, Typography, Spin, Card, Row, Col, Tag } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';

const { Content } = Layout;
const { Title, Text } = Typography;

const formatCurrency = (amount) =>
  parseFloat(amount).toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });

const OrderHistoryPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, loading, error } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user && user.iduser) {
      dispatch(fetchCustomerOrders(user.iduser));
    }
  }, [dispatch, user]);

  return (
    <Layout className="bg-transparent">
      <Content className="p-4">
        <div className="bg-white/20 backdrop-blur-md rounded-lg shadow-md p-6">
          <Title level={2} className="text-gray-800 mb-4">Lịch sử đơn hàng</Title>

          {loading ? (
            <div className="flex justify-center items-center">
              <Spin size="large" />
            </div>
          ) : error ? (
            <Text type="danger">Lỗi: {error}</Text>
          ) : orders && orders.length > 0 ? (
            <Row gutter={[16, 16]}>
              {orders.map((order) => (
                <Col key={order.order_id} xs={24} sm={24} md={12} lg={8}>
                  <Card
                    title={`Đơn hàng #${order.order_id}`}
                    bordered
                    className="bg-white/10 border border-white/30 rounded-xl"
                    extra={<Tag color="blue">{order.order_status}</Tag>}
                    onClick={() => navigate(`/order-detail/${order.order_id}`)}
                    hoverable
                  >
                    <p><strong>Khách hàng:</strong> {order.customer?.customer_name || order.customer_id}</p>
                    <p><strong>Loại khách:</strong> {order.customer?.customerType?.name || 'N/A'}</p>
                    <p><strong>Ngày đặt:</strong> {new Date(order.order_date).toLocaleString()}</p>
                    <p><strong>Nhân viên:</strong> {order.salesRep?.full_name || 'Chưa có'}</p>
                    <p><strong>Tổng tiền hàng:</strong> {formatCurrency(order.amount)}</p>
                    <p><strong>Chiết khấu:</strong> {formatCurrency(order.discount_applied)}</p>
                    <p><strong>Thanh toán:</strong> {formatCurrency(order.final_amount)}</p>
                    {order.promotions?.length > 0 && (
                      <div>
                        <strong>Khuyến mãi:</strong>
                        <div className="mt-1">
                          {order.promotions.map((promo) => (
                            <Tag key={promo.promo_id} color="green">{promo.promo_name}</Tag>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Text>Không có đơn hàng nào.</Text>
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default OrderHistoryPage;