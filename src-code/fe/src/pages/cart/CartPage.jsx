import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../../redux/slices/cartSlice';
import CartItem from '../../components/CartItem';
import { Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const selectedPromotion = useSelector((state) => state.cart.selectedPromotion);

  const handleRemoveFromCart = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleUpdateQuantity = (productId, quantity) => {
    dispatch(updateQuantity({ product_id: productId, quantity }));
  };

  const handleCheckout = () => {
    navigate('/order-summary');
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const subtotal = calculateSubtotal();

  // ✅ Fix logic tính giảm giá theo loại
  const discountAmount = selectedPromotion
    ? selectedPromotion.promotionType?.type === 'percent'
      ? (subtotal * parseFloat(selectedPromotion.discount_value)) / 100
      : Math.min(parseFloat(selectedPromotion.discount_value), subtotal)
    : 0;

  const total = subtotal - discountAmount;

  return (
    <div className="container mx-auto p-4 md:p-8 lg:p-12 bg-opacity-20 backdrop-blur-md rounded-lg shadow-lg border border-gray-200">
      <Title level={2} className="text-center mb-4">Giỏ hàng</Title>

      {cartItems.length === 0 ? (
        <div className="text-center">
          <Text type="secondary">Giỏ hàng trống</Text>
        </div>
      ) : (
        <div>
          {cartItems.map((item) => (
            <CartItem
              key={item.product.product_id}
              item={item}
              onRemove={handleRemoveFromCart}
              onUpdateQuantity={handleUpdateQuantity}
            />
          ))}

          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <Text strong>Tổng tiền hàng:</Text>
              <Text>{subtotal.toLocaleString()} VNĐ</Text>
            </div>
            {selectedPromotion && (
              <div className="flex justify-between items-center mb-2">
                <Text strong>Khuyến mãi:</Text>
                <Text>- {discountAmount.toLocaleString()} VNĐ</Text>
              </div>
            )}
            <div className="flex justify-between items-center mb-4">
              <Text strong>Tổng thanh toán:</Text>
              <Text className="text-lg font-semibold">{total.toLocaleString()} VNĐ</Text>
            </div>

            <Button type="" size="large" block onClick={handleCheckout} className="glassmorphism-button">
              Tiến hành thanh toán
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
