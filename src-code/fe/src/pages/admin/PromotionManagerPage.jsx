import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPromotions } from '../../redux/slices/promotionSlice';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  message,
  Tag,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import orderService from '../../services/orderService';
import moment from 'moment';

const { Option } = Select;

const PromotionManagerPage = () => {
  const dispatch = useDispatch();
  const { promotions, loading } = useSelector((state) => state.promotion);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [promotionTypes, setPromotionTypes] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    dispatch(fetchPromotions());
    orderService.fetchPromotionTypes().then(setPromotionTypes).catch(() => message.error('Failed to fetch promotion types'));
    orderService.fetchProducts().then(setProducts).catch(() => message.error('Không tải được danh sách sản phẩm'));
  }, [dispatch]);

  const columns = [
    { title: 'ID', dataIndex: 'promo_id', key: 'promo_id' },
    { title: 'Name', dataIndex: 'promo_name', key: 'promo_name' },
    { title: 'Type', dataIndex: 'promotionType', key: 'promotion_details_id', render: (type) => type?.name || 'N/A' },
    { title: 'Discount Value', dataIndex: 'discount_value', key: 'discount_value' },
    { title: 'Start Date', dataIndex: 'start_date', key: 'start_date', render: (text) => moment(text).format('YYYY-MM-DD') },
    { title: 'End Date', dataIndex: 'end_date', key: 'end_date', render: (text) => moment(text).format('YYYY-MM-DD') },
    { title: 'Promo Code', dataIndex: 'promo_code', key: 'promo_code' },
    {
      title: 'Áp dụng cho SP',
      dataIndex: 'productPromotions',
      key: 'productPromotions',
      render: (list) =>
        list && list.length > 0
          ? list.map((p) => <Tag key={p.product_id}>{p.product_name}</Tag>)
          : 'Tất cả sản phẩm',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>Edit</Button>
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.promo_id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  const showModal = () => setIsModalOpen(true);

  const handleOk = () => {
    form.validateFields().then((values) => {
      const formattedValues = {
        ...values,
        start_date: values.start_date.format('YYYY-MM-DD'),
        end_date: values.end_date.format('YYYY-MM-DD'),
        product_ids: values.product_ids || [],
      };

      if (editingPromotion) {
        orderService.updatePromotion({ promo_id: editingPromotion.promo_id, ...formattedValues })
          .then(() => {
            dispatch(fetchPromotions());
            message.success('Promotion updated successfully');
          })
          .catch(() => message.error('Failed to update promotion'));
      } else {
        orderService.createPromotion(formattedValues)
          .then(() => {
            dispatch(fetchPromotions());
            message.success('Promotion created successfully');
          })
          .catch(() => message.error('Failed to create promotion'));
      }

      setIsModalOpen(false);
      form.resetFields();
      setEditingPromotion(null);
    }).catch((info) => {
      console.log('Validate Failed:', info);
      message.error('Please check the form values');
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingPromotion(null);
  };

  const handleCreate = () => {
    setEditingPromotion(null);
    showModal();
  };

  const handleEdit = (record) => {
    setEditingPromotion(record);
    form.setFieldsValue({
      ...record,
      promotion_details_id: Number(record.promotion_details_id),
      start_date: moment(record.start_date),
      end_date: moment(record.end_date),
      product_ids: record.productPromotions?.map((p) => p.product_id) || [],
    });
    showModal();
  };

  const handleDelete = (id) => {
    orderService.deletePromotion(id)
      .then(() => {
        dispatch(fetchPromotions());
        message.success('Promotion deleted successfully');
      })
      .catch(() => message.error('Failed to delete promotion'));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Promotion Management</h1>
        <Button type="" icon={<PlusOutlined />} onClick={handleCreate}>
          Add Promotion
        </Button>
      </div>

      <Table columns={columns} dataSource={promotions} loading={loading} rowKey="promo_id" />

      <Modal
        title={editingPromotion ? 'Edit Promotion' : 'Create Promotion'}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="promo_name" label="Promotion Name" rules={[{ required: true, message: 'Please input promotion name!' }]}> 
            <Input placeholder="Promotion Name" className="glassmorphism-input" />
          </Form.Item>

          <Form.Item name="promotion_details_id" label="Promotion Type" rules={[{ required: true, message: 'Please select a promotion type!' }]}> 
            <Select placeholder="Select Promotion Type" className="glassmorphism-input">
              {promotionTypes.map((type) => (
                <Option key={type.promotion_details_id} value={type.promotion_details_id}>{type.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="discount_value" label="Discount Value" rules={[{ required: true, message: 'Please input discount value!' }]}> 
            <Input placeholder="Discount Value" type="number" className="glassmorphism-input" /> 
          </Form.Item>

          <Form.Item name="start_date" label="Start Date" rules={[{ required: true, message: 'Please select start date!' }]}> 
            <DatePicker style={{ width: '100%' }} className="glassmorphism-input" /> 
          </Form.Item>
          <Form.Item name="end_date" label="End Date" rules={[{ required: true, message: 'Please select end date!' }]}> 
            <DatePicker style={{ width: '100%' }} className="glassmorphism-input" /> 
          </Form.Item>

          <Form.Item name="promo_code" label="Promotion Code"> 
            <Input placeholder="Promotion Code" className="glassmorphism-input" /> 
          </Form.Item>

          <Form.Item name="product_ids" label="Sản phẩm áp dụng">
            <Select
              mode="multiple"
              placeholder="Chọn sản phẩm áp dụng"
              optionFilterProp="children"
              className="glassmorphism-input"
            >
              {products.map((p) => (
                <Option key={p.product_id} value={p.product_id}>{p.product_name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PromotionManagerPage;
