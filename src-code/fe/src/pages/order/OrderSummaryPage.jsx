import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  Button,
  Typography,
  Divider,
  message,
  Checkbox,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {
  clearCart,
  applyPromotion,
  removePromotion,
} from '../../redux/slices/cartSlice';
import orderService from '../../services/orderService';
import { fetchCustomerByUser } from '../../redux/slices/customerSlice';
import { fetchPromotions } from '../../redux/slices/promotionSlice';
import ProductCard from '../../components/ProductCard';

const { Title } = Typography;

const OrderSummaryPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, selectedPromotions } = useSelector((state) => state.cart);
  const { customer } = useSelector((state) => state.customer);
  const { user } = useSelector((state) => state.auth);
  const { promotions } = useSelector((state) => state.promotion);

  const [totalAmount, setTotalAmount] = useState(0);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [customerDiscount, setCustomerDiscount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);

  useEffect(() => {
    dispatch(fetchPromotions());
    if (user?.iduser) {
      dispatch(fetchCustomerByUser(user.iduser));
    }
  }, [dispatch, user]);

  useEffect(() => {
    let subtotal = items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
    let promoD = 0;
  
    const cartProductIds = items.map((i) => i.product_id);
  
    selectedPromotions.forEach((promo) => {
      const { type } = promo.promotionType;
      const value = parseFloat(promo.discount_value);
  
      if (type === 'bundle') {
        const requiredIds = promo.productPromotions?.map((p) => p.product_id) || [];
        const hasAll = requiredIds.every((pid) => cartProductIds.includes(pid));
        if (hasAll) promoD += value;
      } else if (promo.productPromotions?.length > 0) {
        promo.productPromotions.forEach((pp) => {
          const item = items.find((i) => i.product_id === pp.product_id);
          if (item) {
            const itemTotal = item.product.price * item.quantity;
            if (type === 'percent') {
              promoD += itemTotal * (value / 100);
            } else if (type === 'fixed_amount') {
              promoD += Math.min(value, itemTotal);
            }
          }
        });
      } else {
        if (type === 'percent') {
          promoD += subtotal * (value / 100);
        } else if (type === 'fixed_amount') {
          promoD += Math.min(value, subtotal);
        }
      }
    });
  
    const afterPromo = subtotal - promoD;
  
    let customerD = 0;
    const customerRate = parseFloat(customer?.customerType?.rate_type || 0);
  
    // ❗ Chỉ áp dụng nếu KHÔNG có khuyến mãi nào
    if (selectedPromotions.length === 0 && customerRate > 0) {
      customerD = afterPromo * (customerRate / 100);
    }
  
    setTotalAmount(subtotal);
    setPromoDiscount(promoD);
    setCustomerDiscount(customerD);
    setFinalAmount(subtotal - promoD - customerD);
  }, [items, selectedPromotions, customer]);

  const handleConfirmOrder = async () => {
    try {
      const orderData = {
        customer_id: customer?.customer_id,
        amount: totalAmount,
        discount_applied: promoDiscount + customerDiscount,
        final_amount: finalAmount,
        items: items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          amount: item.product.price * item.quantity,
          discount: 0,
          final_amount: item.product.price * item.quantity,
        })),
        promo_ids: selectedPromotions.map((p) => p.promo_id),
      };

      const res = await orderService.createOrder(orderData);
      if (res?.order_id) {
        message.success('Đặt hàng thành công!');
        dispatch(clearCart());
        navigate('/order-history');
      } else {
        message.error('Đặt hàng thất bại. Vui lòng thử lại!');
      }
    } catch (err) {
      console.error(err);
      message.error('Đã có lỗi xảy ra khi đặt hàng.');
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 px-4">
        <div className="text-center bg-white/50 backdrop-blur-lg rounded-xl shadow-lg px-6 py-10">
          <Title level={3}>Giỏ hàng đang trống</Title>
          <Link to="/products">
            <Button type="primary" icon={<PlusOutlined />}>
              Xem sản phẩm
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ backgroundImage: `url('https://raw.githubusercontent.com/CiurescuP/LogIn-Form/main/bg.jpg')` }}
      className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 px-4 py-10 flex justify-center"
    >
      <div className="w-full max-w-5xl bg-white/20 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 p-8 text-white font-quicksand">
        <h2 className="text-3xl font-bold text-center mb-8 text-white">
          Tóm tắt đơn hàng
        </h2>

        <div className="mb-6 space-y-2 text-base">
          <h3 className="text-xl font-semibold text-white">Thông tin khách hàng</h3>
          {customer ? (
            <div className="space-y-1">
              <p><span className="font-semibold">Họ tên:</span> {customer.customer_name}</p>
              <p><span className="font-semibold">Email:</span> {customer.primary_email}</p>
              <p><span className="font-semibold">Địa chỉ:</span> {customer.address}</p>
              <p><span className="font-semibold">Loại:</span> {customer.customerType?.name || 'Không xác định'}</p>
              <p><span className="font-semibold">Giảm giá loại KH:</span> {customer.customerType?.rate_type || 0}%</p>
            </div>
          ) : (
            <div>
              <p>Chưa có thông tin khách hàng.</p>
              <Link to="/register-customer">
                <Button className="mt-2" type="primary">Bổ sung hồ sơ</Button>
              </Link>
            </div>
          )}
        </div>

        <Divider className="border-white/30" />

        <h3 className="text-xl font-semibold mb-4 text-white">Sản phẩm</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {items.map((item) => (
            <ProductCard
              key={item.product_id}
              product={item.product}
              quantity={item.quantity}
            />
          ))}
        </div>

        <Divider className="border-white/30" />

        <h3 className="text-xl font-semibold mb-4 text-white">Chọn khuyến mãi áp dụng</h3>
        <div className="space-y-2">
          {promotions
            .filter((promo) => {
              const cartProductIds = items.map((item) => item.product_id);
              const promoProductIds = promo.productPromotions?.map((p) => p.product_id) || [];

              if (promo.promotionType?.type === 'bundle') {
                return promoProductIds.every((id) => cartProductIds.includes(id));
              }

              if (promoProductIds.length === 0) return true;
              return promoProductIds.some((id) => cartProductIds.includes(id));
            })
            .map((promo) => (
              <div key={promo.promo_id} className="text-white">
                <Checkbox
                  className="text-white"
                  checked={selectedPromotions.some((p) => p.promo_id === promo.promo_id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      dispatch(applyPromotion(promo));
                    } else {
                      dispatch(removePromotion(promo.promo_id));
                    }
                  }}
                >
                  {promo.promo_name} ({promo.promotionType.name})
                </Checkbox>
              </div>
            ))}
        </div>

        <Divider className="border-white/30" />

        <div className="space-y-1 text-lg">
          <p><span className="font-semibold">Tạm tính:</span> {totalAmount.toLocaleString()} VND</p>
          <p className="text-red-300"><span className="font-semibold">Khuyến mãi:</span> -{promoDiscount.toLocaleString()} VND</p>
          <p className="text-red-300"><span className="font-semibold">Chiết khấu loại KH:</span> -{customerDiscount.toLocaleString()} VND</p>
          <p className="text-emerald-300 font-bold text-xl"><span className="font-semibold">Thành tiền:</span> {finalAmount.toLocaleString()} VND</p>
        </div>

        <Button
          size="large"
          className="mt-8 w-full bg-black/20 text-white border border-white/30 hover:bg-emerald-500 hover:text-white transition-all duration-300"
          onClick={handleConfirmOrder}
        >
          Xác nhận đặt hàng
        </Button>
      </div>
    </div>
  );
};

export default OrderSummaryPage;
