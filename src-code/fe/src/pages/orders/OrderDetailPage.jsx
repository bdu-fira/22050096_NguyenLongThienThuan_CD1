import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderById } from '../../redux/slices/orderSlice';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Layout,
  Typography,
  Descriptions,
  Spin,
  List,
  Card,
  Tag,
  Divider,
  Button,
  message,
} from 'antd';
import { Row, Col } from 'antd';
import contractService from '../../services/contractService';

const { Text, Title } = Typography;
const { Content } = Layout;

const formatCurrency = (amount) =>
  parseFloat(amount).toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentOrder, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (error && error.includes('Not Found')) {
      navigate('/orders');
    }
  }, [error, navigate]);
  const handleCreateContract = async () => {
    try {
      const response = await contractService.createContract(id)
  
      message.success( 'Đã gửi yêu cầu tạo hợp đồng');
    } catch (error) {
      console.error(error);
      message.error(error.response?.data?.message || 'Tạo hợp đồng thất bại');
    }
  };
  
  return (
    <Layout className="bg-transparent font-[Quicksand]">
      <Content className="p-6">
        <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-lg p-8 text-white">
          <Title level={2} className="text-white mb-6">🧾 Chi tiết đơn hàng #{id}</Title>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Spin size="large" />
            </div>
          ) : error ? (
            <Text type="danger">Lỗi: {error}</Text>
          ) : currentOrder ? (
            <>
              <Descriptions bordered column={1} className="text-white bg-transparent mb-6">
                <Descriptions.Item label="📌 Mã đơn hàng">{currentOrder.order_id}</Descriptions.Item>
                <Descriptions.Item label="👤 Khách hàng">{currentOrder.customer?.customer_name || currentOrder.customer_id}</Descriptions.Item>
                <Descriptions.Item label="👥 Loại khách hàng">
                  {currentOrder.customer?.customerType?.name || 'Không xác định'}
                </Descriptions.Item>
                <Descriptions.Item label="🕐 Ngày đặt">{new Date(currentOrder.order_date).toLocaleString()}</Descriptions.Item>
                <Descriptions.Item label="👨‍💼 Nhân viên phụ trách">{currentOrder.salesRep?.staff_name || 'Chưa có'}</Descriptions.Item>
                <Descriptions.Item label="💰 Tổng tiền hàng">{formatCurrency(currentOrder.amount)}</Descriptions.Item>
                <Descriptions.Item label="🏷️ Chiết khấu (khuyến mãi)">
                  {formatCurrency(currentOrder.discount_applied)}
                </Descriptions.Item>
                {currentOrder.customer_discount && (
                  <Descriptions.Item label="💼 Chiết khấu theo loại khách hàng">
                    {formatCurrency(currentOrder.customer_discount)}
                  </Descriptions.Item>
                )}
                <Descriptions.Item label="✅ Thanh toán">{formatCurrency(currentOrder.final_amount)}</Descriptions.Item>
                <Descriptions.Item label="📦 Trạng thái">
                  <Tag color="blue">{currentOrder.order_status}</Tag>
                  {currentOrder.order_status === 'chờ thanh toán' && (
                    <Button
                      type="primary"
                      className="ml-4"
                      size="small"
                      onClick={handleCreateContract}
                    >
                      xác nhận thanh toán
                    </Button>
                  )}
                </Descriptions.Item>
              </Descriptions>

              <Divider className="border-white/30" />

              <Title level={4} className="text-white mb-3">📦 Sản phẩm đã mua</Title>
              <Row gutter={[16, 16]}>
                {currentOrder.orderDetails.map((item) => (
                  <Col key={item.invoice_details_id} xs={24} sm={12} md={8} lg={6}>
                    <Card
                      title={item.product?.product_name || `Sản phẩm ${item.product_id}`}
                      bordered
                      className="bg-white/10 border-2 shadow-xl border-white/30 rounded-xl"
                    >
                      <p>🔢 <Text strong>Số lượng:</Text> {item.quantity}</p>
                      <p>💵 <Text strong>Đơn giá:</Text> {formatCurrency(item.amount)}</p>
                      <p>🏷️ <Text strong>Chiết khấu:</Text> {formatCurrency(item.discount)}</p>
                      <p>✅ <Text strong>Thành tiền:</Text> <span className="text-emerald-400">{formatCurrency(item.final_amount)}</span></p>
                    </Card>
                  </Col>
                ))}
              </Row>

              {currentOrder.promotions?.length > 0 && (
                <>
                  <Divider className="border-white/30" />
                  <Title level={4} className="text-white mb-3">🎁 Khuyến mãi áp dụng</Title>
                  {currentOrder.promotions.map((promo) => (
                    <Tag color="green" key={promo.promo_id} className="text-base mr-2 mb-2">
                      {promo.promo_name} ({promo.promotionType?.name})
                    </Tag>
                  ))}
                </>
              )}
            </>
          ) : (
            <Text>Không tìm thấy đơn hàng.</Text>
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default OrderDetailPage;
