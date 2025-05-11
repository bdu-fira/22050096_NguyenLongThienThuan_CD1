import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Card,
  Typography,
  Button,
  Descriptions,
  Tag,
  message,
  Divider,
  InputNumber,
  Select,
} from 'antd';
import moment from 'moment';
import { fetchOrderById, updateOrder } from '../../redux/slices/orderSlice';
import { fetchPromotions } from '../../redux/slices/promotionSlice';

const { Title } = Typography;

const formatCurrency = (amount) =>
  parseFloat(amount).toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });

const EmployeeOrderDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentOrder, loading } = useSelector((state) => state.order);
  const { promotions } = useSelector((state) => state.promotion);

  const [editableOrder, setEditableOrder] = useState(null);
  const [selectedPromoIds, setSelectedPromoIds] = useState([]);

  useEffect(() => {
    dispatch(fetchOrderById(id));
    dispatch(fetchPromotions());
  }, [dispatch, id]);

  useEffect(() => {
    if (currentOrder) {
      const cloned = JSON.parse(JSON.stringify(currentOrder));
      setEditableOrder(cloned);
      setSelectedPromoIds(cloned.promotions?.map((p) => p.promo_id) || []);
    }
  }, [currentOrder]);

  useEffect(() => {
    if (editableOrder && promotions.length) {
      const selectedPromos = promotions.filter((p) => selectedPromoIds.includes(p.promo_id));
      setEditableOrder((prev) => ({ ...prev, promotions: selectedPromos }));
    }
  }, [selectedPromoIds, promotions]);

  const fullPromoList = useMemo(() => {
    if (!editableOrder || !editableOrder.orderDetails) return [];

    const productIds = editableOrder.orderDetails.map((i) => i.product.product_id);

    const globalPromotions = promotions.filter(
      (promo) => !promo.productPromotions || promo.productPromotions.length === 0
    );

    const matchingPromotions = promotions.filter(
      (promo) =>
        promo.productPromotions?.length > 0 &&
        promo.productPromotions.some((pp) => productIds.includes(pp.product_id))
    );

    const allPromos = [...matchingPromotions, ...globalPromotions];
    const promoMap = new Map();
    allPromos.forEach((promo) => {
      promoMap.set(promo.promo_id, promo);
    });

    return Array.from(promoMap.values());
  }, [editableOrder?.orderDetails, promotions]);

  const getPromoDiscountPerItem = (promo, item) => {
    const type = promo.promotionType?.type;
    const value = parseFloat(promo.discount_value);
    const total = item.product.price * item.quantity;

    if (!promo.productPromotions?.length || type === 'bundle') return 0;

    const isMatched = promo.productPromotions.some(
      (pp) => pp.product_id === item.product.product_id
    );

    if (!isMatched) return 0;

    if (type === 'percent') return (total * value) / 100;
    if (type === 'fixed_amount') return Math.min(value, total);

    return 0;
  };

  const getPromoDiscount = (promo, items) => {
    const type = promo.promotionType?.type;
    const value = parseFloat(promo.discount_value);
    let discount = 0;

    if (type === 'bundle') {
      const requiredProductIds = promo.productPromotions?.map((pp) => pp.product_id) || [];
      const hasAll = requiredProductIds.every((pid) =>
        items.some((item) => item.product.product_id === pid)
      );
      if (hasAll) discount = value;
    } else if (promo.productPromotions?.length > 0) {
      promo.productPromotions.forEach((pp) => {
        const item = items.find((i) => i.product.product_id === pp.product_id);
        if (item) {
          const total = item.product.price * item.quantity;
          if (type === 'percent') {
            discount += (total * value) / 100;
          } else if (type === 'fixed_amount') {
            discount += Math.min(value, total);
          }
        }
      });
    } else {
      const subtotal = items.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
      if (type === 'percent') {
        discount = (subtotal * value) / 100;
      } else if (type === 'fixed_amount') {
        discount = Math.min(value, subtotal);
      }
    }

    return discount;
  };

  const handleQuantityChange = (productId, value) => {
    const updatedDetails = editableOrder.orderDetails.map((item) =>
      item.product.product_id === productId ? { ...item, quantity: value } : item
    );
    setEditableOrder({ ...editableOrder, orderDetails: updatedDetails });
  };

  const handleRemoveProduct = (productId) => {
    const updatedDetails = editableOrder.orderDetails.filter(
      (item) => item.product.product_id !== productId
    );
    setEditableOrder({ ...editableOrder, orderDetails: updatedDetails });
  };

  const handlePromoChange = (promoIds) => {
    setSelectedPromoIds(promoIds);
  };

  const handleUpdateOrder = async () => {
    const orderData = {
      order_id: editableOrder.order_id,
      customer_id: editableOrder.customer.customer_id,
      items: editableOrder.orderDetails.map((item) => ({
        product_id: item.product.product_id,
        quantity: item.quantity,
      })),
      promo_ids: selectedPromoIds,
    };

    try {
      await dispatch(updateOrder({ id: editableOrder.order_id, data: orderData })).unwrap();
      message.success('Cập nhật đơn hàng thành công!');
    } catch (error) {
      message.error('Lỗi cập nhật đơn hàng: ' + error.message);
    }
  };

  if (loading || !editableOrder) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Title level={3}>Đang tải thông tin đơn hàng...</Title>
      </div>
    );
  }

  const subtotal = editableOrder.orderDetails.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const appliedDiscounts = editableOrder.promotions.map((promo) => ({
    ...promo,
    discountAmount: getPromoDiscount(promo, editableOrder.orderDetails),
  }));

  const totalDiscount = appliedDiscounts.reduce((acc, p) => acc + p.discountAmount, 0);

  const hasPromo = appliedDiscounts.length > 0;
  const customerTypeRate = parseFloat(editableOrder.customer?.customerType?.rate_type || 0);
  const customerTypeDiscount = !hasPromo && !isNaN(customerTypeRate) && customerTypeRate > 0
    ? (subtotal - totalDiscount) * customerTypeRate / 100
    : 0;

  const finalAmount = subtotal - totalDiscount - customerTypeDiscount;

  return (
    <div className="container mx-auto py-8 px-4 font-[Quicksand]">
      <Card
        title={<Title level={2}>Chi tiết đơn hàng #{editableOrder.order_id}</Title>}
        className="glassmorphism-card shadow-lg rounded-xl"
      >
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Ngày đặt hàng">
            {moment(editableOrder.order_date).format('DD/MM/YYYY HH:mm')}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag color="blue">{editableOrder.order_status || 'Chưa cập nhật'}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Nhân viên phụ trách">
            {editableOrder.salesRep?.staff_name || 'Chưa phân công'}
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        <Title level={4}>Thông tin khách hàng</Title>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Tên khách hàng">
            {editableOrder.customer?.customer_name}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {editableOrder.customer?.primary_email}
          </Descriptions.Item>
          <Descriptions.Item label="Người liên hệ">
            {editableOrder.customer?.contact_person}
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ">
            {editableOrder.customer?.address}
          </Descriptions.Item>
          {editableOrder.customer?.tax_code && (
            <Descriptions.Item label="Mã số thuế">
              {editableOrder.customer.tax_code}
            </Descriptions.Item>
          )}
          {editableOrder.customer?.customerType?.name && (
            <Descriptions.Item label="Loại khách hàng">
              <Tag color="orange">{editableOrder.customer.customerType.name}</Tag>
            </Descriptions.Item>
          )}
        </Descriptions>

        <Divider />

        <Title level={4}>Sản phẩm trong đơn</Title>
        {editableOrder.orderDetails.map((item) => {
          const product = item.product;
          const quantity = item.quantity;
          const price = product.price;
          const itemTotal = price * quantity;

          const productDiscount = appliedDiscounts.reduce(
            (acc, promo) => acc + getPromoDiscountPerItem(promo, item),
            0
          );

          const globalPromos = appliedDiscounts.filter((p) => !p.productPromotions?.length);
          const globalDiscount = globalPromos.reduce((acc, promo) => {
            const ratio = itemTotal / subtotal;
            return acc + promo.discountAmount * ratio;
          }, 0);

          const totalItemDiscount = productDiscount + globalDiscount;
          const final = itemTotal - totalItemDiscount;

          return (
            <Card
              key={item.invoice_details_id}
              type="inner"
              className="mb-4 border border-gray-200 rounded-xl"
            >
              <p><strong>Sản phẩm:</strong> {product.product_name}</p>
              <p><strong>Giá gốc:</strong> {formatCurrency(price)}</p>
              <p><strong>Số lượng:</strong> <InputNumber min={1} value={quantity} onChange={(value) => handleQuantityChange(product.product_id, value)} /></p>
              <p className="text-red-500"><strong>Chiết khấu:</strong> -{formatCurrency(totalItemDiscount)}</p>
              <p className="text-green-600 font-bold"><strong>Thành tiền:</strong> {formatCurrency(final)}</p>
              <Button type="link" danger onClick={() => handleRemoveProduct(product.product_id)}>Xoá sản phẩm</Button>
            </Card>
          );
        })}

        <Divider />

        <Title level={4}>Khuyến mãi áp dụng</Title>
        <Select
          mode="multiple"
          className="w-full"
          placeholder="Chọn mã khuyến mãi"
          value={selectedPromoIds}
          onChange={handlePromoChange}
          optionLabelProp="label"
        >
          {fullPromoList.map((promo) => (
            <Select.Option
              key={promo.promo_id}
              value={promo.promo_id}
              label={promo.promo_name}
            >
              {promo.promo_name} ({promo.promotionType?.name})
            </Select.Option>
          ))}
        </Select>

        {appliedDiscounts.length > 0 && (
          <>
            <Divider />
            <Title level={5}>Chiết khấu từng mã</Title>
            {appliedDiscounts.map((p) => (
              <p key={p.promo_id} className="text-white">
                <Tag color="green">{p.promo_name}</Tag> - {formatCurrency(p.discountAmount)}
              </p>
            ))}
          </>
        )}

        <Divider />
        <Title level={4}>Tổng kết đơn hàng</Title>
        <div className="space-y-1 text-lg">
          <p><span className="font-semibold">Tạm tính:</span> {formatCurrency(subtotal)}</p>
          <p className="text-red-500"><span className="font-semibold">Khuyến mãi:</span> -{formatCurrency(totalDiscount)}</p>
          {customerTypeDiscount > 0 && (
            <p className="text-orange-400">
              <span className="font-semibold">Chiết khấu theo loại KH ({editableOrder.customer.customerType.name}):</span> -{formatCurrency(customerTypeDiscount)}
            </p>
          )}
          <p className="text-emerald-600 font-bold text-xl"><span className="font-semibold">Thành tiền:</span> {formatCurrency(finalAmount)}</p>
        </div>

        <div className="text-center mt-6">
          <Button type="" size="large" onClick={handleUpdateOrder}>
            xác nhận báo giá
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default EmployeeOrderDetailPage;
