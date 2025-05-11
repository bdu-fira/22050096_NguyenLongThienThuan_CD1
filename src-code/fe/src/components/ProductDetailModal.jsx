import React from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const ProductDetailModal = ({ product, onPrev, onNext, onAddToCart }) => {
  if (!product) return null;

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4">
      {/* Hình ảnh */}
      <div className="w-full md:w-1/2">
        <img
          src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
          alt={product.product_name}
          className="w-full h-auto rounded-lg shadow"
        />
      </div>

      {/* Thông tin */}
      <div className="w-full md:w-1/2 space-y-3">
        <h2 className="text-2xl font-bold text-blue-700">{product.product_name}</h2>
        <p className="text-gray-600">{product.description}</p>
        <p className="text-lg font-semibold text-gray-800">
          Giá: {parseInt(product.price).toLocaleString()} VND
        </p>
        <p>Số lượng tồn kho: {product.stock_quantity}</p>

        <div className="flex space-x-4 mt-4">
          <button onClick={onPrev} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
            <LeftOutlined />
          </button>
          <button onClick={onNext} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
            <RightOutlined />
          </button>
        </div>

        <button
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={onAddToCart}
        >
          Thêm vào giỏ hàng
        </button>
      </div>
    </div>
  );
};

export default ProductDetailModal;
