import React from 'react';
import { Card } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  addToCart,
  updateQuantity,
  removeFromCart
} from '../redux/slices/cartSlice'; // điều chỉnh nếu path khác

const { Meta } = Card;

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const {
    product_id,
    product_name,
    price,
    description,
  } = product || {};

  const cartItem = cartItems.find(item => item.product_id === product_id);

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  const handleIncrease = () => {
    dispatch(updateQuantity({ product_id, quantity: cartItem.quantity + 1 }));
  };

  const handleDecrease = () => {
    if (cartItem.quantity === 1) {
      dispatch(removeFromCart(product_id));
    } else {
      dispatch(updateQuantity({ product_id, quantity: cartItem.quantity - 1 }));
    }
  };

  return (
    <Card
      hoverable
      style={{
        width: 240,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(5px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px'
      }}
      cover={
        <img
          alt={product_name}
          src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
          style={{ padding: '10px' }}
        />
      }
    >
      <Meta
        title={product_name}
        description={
          <>
            <p>Giá: {price}</p>
            <p>{description?.substring(0, 50)}...</p>
          </>
        }
      />

      <div className="mt-4 flex justify-center items-center gap-2">
        {cartItem ? (
          <>
            <button
              onClick={handleDecrease}
              className="bg-red-500 hover:bg-red-700 text-white font-bold px-2 rounded"
            >
              -
            </button>
            <span className="font-semibold text-lg">{cartItem.quantity}</span>
            <button
              onClick={handleIncrease}
              className="bg-green-500 hover:bg-green-700 text-white font-bold px-2 rounded"
            >
              +
            </button>
          </>
        ) : (
          <button
            onClick={handleAddToCart}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Thêm vào giỏ hàng
          </button>
        )}
      </div>
    </Card>
  );
};

export default ProductCard;
