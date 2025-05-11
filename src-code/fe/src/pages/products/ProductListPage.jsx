import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../redux/slices/categorySlice';
import { fetchPromotions } from '../../redux/slices/promotionSlice';
import {
  Modal,
  Spin,
  InputNumber,
  Select,
  Input,
  Typography,
  Button,
  Divider
} from 'antd';
import {
  LoadingOutlined,
  SearchOutlined,
  FilterOutlined,
  LeftOutlined,
  RightOutlined
} from '@ant-design/icons';
import {
  addToCart,
  updateQuantity,
  applyPromotion
} from '../../redux/slices/cartSlice';
import ProductCard from '../../components/ProductCard';

const { Title } = Typography;

const ProductListPage = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.category);
  const { promotions } = useSelector((state) => state.promotion);
  const cartItems = useSelector((state) => state.cart.items);

  const [visible, setVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedPromoIds, setSelectedPromoIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategoryId, setFilterCategoryId] = useState(null);
  const [flatProductList, setFlatProductList] = useState([]);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchPromotions());
  }, [dispatch]);

  useEffect(() => {
    const allProducts = categories.flatMap((cat) => cat.products || []);
    setFlatProductList(allProducts);
  }, [categories]);

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setSelectedPromoIds([]);
    setVisible(true);
  };

  const handleNavigateProduct = (direction) => {
    if (!selectedProduct) return;
    const index = flatProductList.findIndex(p => p.product_id === selectedProduct.product_id);
    const newIndex = direction === 'prev' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < flatProductList.length) {
      setSelectedProduct(flatProductList[newIndex]);
      setSelectedPromoIds([]);
    }
  };

  const applicablePromos = promotions.filter((promo) =>
    promo.productPromotions?.some(
      (p) => p.product_id === selectedProduct?.product_id
    )
  );

  const cartItem = selectedProduct
    ? cartItems.find((item) => item.product_id === selectedProduct.product_id)
    : null;

  const handleAddToCart = () => {
    const productWithPromo = {
      ...selectedProduct,
      appliedPromoIds: selectedPromoIds
    };
    dispatch(addToCart(productWithPromo));

    const selectedPromos = applicablePromos.filter((p) =>
      selectedPromoIds.includes(p.promo_id)
    );
    selectedPromos.forEach((promo) => dispatch(applyPromotion(promo)));
  };

  const antIcon = <LoadingOutlined style={{ fontSize: 36 }} spin />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-blue-100 py-10 px-4 font-[Quicksand]">
      <div className="max-w-7xl mx-auto">
        <Title level={2} className="text-center text-blue-800 mb-6">
          Danh mục sản phẩm
        </Title>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <Input
            prefix={<SearchOutlined />}
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full md:max-w-xl rounded-lg shadow-sm"
            allowClear
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <Select
            placeholder={<><FilterOutlined /> Lọc theo danh mục</>}
            className="min-w-[200px]"
            allowClear
            value={filterCategoryId}
            onChange={(value) => setFilterCategoryId(value)}
          >
            <Select.Option value={null}>Tất cả</Select.Option>
            {categories.map((cat) => (
              <Select.Option key={cat.category_id} value={cat.category_id}>
                {cat.category_name}
              </Select.Option>
            ))}
          </Select>
        </div>

        <Divider />

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <Spin indicator={antIcon} />
          </div>
        ) : error ? (
          <div className="text-center text-red-600 font-medium text-lg">
            Lỗi: {error}
          </div>
        ) : (
          categories
            .filter((cat) => !filterCategoryId || cat.category_id === filterCategoryId)
            .map((category) => {
              const filteredProducts = category.products?.filter((product) =>
                product.product_name.toLowerCase().includes(searchQuery.toLowerCase())
              );

              if (!filteredProducts || filteredProducts.length === 0) return null;

              return (
                <div key={category.category_id} className="mb-10">
                  <h3 className="text-2xl font-semibold text-blue-600 mb-4">
                    {category.category_name}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.product_id}
                        className="cursor-pointer transition-transform hover:scale-[1.02]"
                        onClick={() => handleOpenModal(product)}
                      >
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
        )}
      </div>

      {/* Modal hiển thị chi tiết sản phẩm */}
      <Modal
        open={visible}
        footer={null}
        onCancel={() => setVisible(false)}
        width="80%"
        className="backdrop-blur-md rounded-xl"
        centered
        bodyStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '1rem' }}
      >
        {selectedProduct && (
          <div className="flex flex-col md:flex-row gap-6 p-6 relative">
            <Button
              shape="circle"
              icon={<LeftOutlined />}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10"
              onClick={() => handleNavigateProduct('prev')}
            />
            <Button
              shape="circle"
              icon={<RightOutlined />}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10"
              onClick={() => handleNavigateProduct('next')}
            />
            <div className="w-full md:w-1/2">
              <img
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                alt={selectedProduct.product_name}
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>

            <div className="w-full md:w-1/2 space-y-4 text-gray-800">
              <h2 className="text-2xl font-bold text-blue-700">
                {selectedProduct.product_name}
              </h2>
              <p className="text-gray-600">{selectedProduct.description}</p>
              <p className="text-lg font-semibold">
                Giá: {parseInt(selectedProduct.price).toLocaleString()} VND
              </p>
              <p>Số lượng tồn kho: {selectedProduct.stock_quantity}</p>

              {applicablePromos.length > 0 && (
                <div>
                  <h4 className="font-semibold text-blue-600">Chọn mã khuyến mãi:</h4>
                  <Select
                    mode="multiple"
                    placeholder="Chọn mã áp dụng"
                    className="w-full"
                    value={selectedPromoIds}
                    onChange={(values) => setSelectedPromoIds(values)}
                    optionLabelProp="label"
                  >
                    {applicablePromos.map((promo) => (
                      <Select.Option
                        key={promo.promo_id}
                        value={promo.promo_id}
                        label={promo.promo_name}
                      >
                        {promo.promo_name} ({promo.promotionType?.name})
                      </Select.Option>
                    ))}
                  </Select>
                </div>
              )}

              <div className="mt-4">
                {cartItem ? (
                  <div className="flex items-center gap-3">
                    <span className="text-gray-700">Số lượng:</span>
                    <InputNumber
                      min={1}
                      max={selectedProduct.stock_quantity}
                      value={cartItem.quantity}
                      onChange={(value) =>
                        dispatch(
                          updateQuantity({
                            product_id: selectedProduct.product_id,
                            quantity: value
                          })
                        )
                      }
                    />
                  </div>
                ) : (
                  <button
                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                    onClick={handleAddToCart}
                  >
                    Thêm vào giỏ hàng
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProductListPage;
