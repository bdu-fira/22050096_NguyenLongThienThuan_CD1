import React from 'react';
import { useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../redux/slices/cartSlice';
import { Button, InputNumber } from 'antd';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  console.log(item);
  
  const handleRemove = () => {
    dispatch(removeFromCart(item.product_id));
  };

  const handleQuantityChange = (value) => {
    dispatch(updateQuantity({ product_id: item.product_id, quantity: value }));
  };

  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-200">
      <div className="flex items-center">
        {/* <img src={`https://via.placeholder.com/50`} alt={item.product_name} className="w-12 h-12 object-cover rounded mr-4" /> */}
        <div>
          <h3 className="font-semibold text-lg">{item.product.product_name}</h3>
          <p className="text-gray-600">Giá: {item.product.price}</p>
        </div>
      </div>
      <div className="flex items-center">
        <InputNumber
          min={1}
          defaultValue={item.quantity}
          onChange={handleQuantityChange}
          className="glassmorphism-input-number mr-2"
        />
        <Button type="text" danger onClick={handleRemove} className="glassmorphism-button">
          Xóa
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
