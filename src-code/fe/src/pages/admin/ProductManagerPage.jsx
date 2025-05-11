import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../redux/slices/productSlice';
import { Table, Button, Space, Input, Select, Modal, Form, message, InputNumber } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import orderService from '../../services/orderService';

const { Option } = Select;

const ProductManagerPage = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.product);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingProduct, setEditingProduct] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    dispatch(fetchProducts());
    orderService.fetchCatagory().then(setCategories).catch(() => message.error('Failed to fetch categories'));
  }, [dispatch]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button type="" onClick={() => handleSearch(selectedKeys, confirm, dataIndex)} icon={<SearchOutlined />} size="small" style={{ width: 90 }}>Search</Button>
          <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small" style={{ width: 90 }}>Reset</Button>
          <Button type="link" size="small" onClick={() => close()}>close</Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) => record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
    render: (text) => searchedColumn === dataIndex ? <span>{text}</span> : text,
  });

  const columns = [
    { title: 'ID', dataIndex: 'product_id', key: 'product_id' },
    { title: 'Name', dataIndex: 'product_name', key: 'product_name', ...getColumnSearchProps('product_name') },
    { title: 'Category ID', dataIndex: 'category_id', key: 'category_id' },
    { title: 'Price', dataIndex: 'price', key: 'price' },
    { title: 'Stock Quantity', dataIndex: 'stock_quantity', key: 'stock_quantity' },
    { title: 'Available', dataIndex: 'available_for_sale', key: 'available_for_sale', render: (text) => (text ? 'Yes' : 'No') },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button onClick={() => handleDelete(record.product_id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  const showModal = () => setIsModalOpen(true);

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (editingProduct) {
        orderService.updateProduct({ product_id: editingProduct.product_id, ...values })
          .then(() => {
            dispatch(fetchProducts());
            message.success('Product updated successfully');
          })
          .catch(() => message.error('Failed to update product'));
      } else {
        orderService.createProduct(values)
          .then(() => {
            dispatch(fetchProducts());
            message.success('Product created successfully');
          })
          .catch(() => message.error('Failed to create product'));
      }
      setIsModalOpen(false);
      form.resetFields();
      setEditingProduct(null);
    }).catch((info) => console.log('Validate Failed:', info));
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingProduct(null);
  };

  const handleCreate = () => {
    setEditingProduct(null);
    showModal();
  };

  const handleEdit = (record) => {
    setEditingProduct(record);
    form.setFieldsValue(record);
    showModal();
  };

  const handleDelete = (id) => {
    orderService.deleteProduct(id)
      .then(() => {
        dispatch(fetchProducts());
        message.success('Product deleted successfully');
      })
      .catch(() => message.error('Failed to delete product'));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Product Management</h1>
        <Button type="" icon={<PlusOutlined />} onClick={handleCreate}>
          Add Product
        </Button>
      </div>

      <Table columns={columns} dataSource={products} loading={loading} rowKey="product_id" />

      <Modal
        title={editingProduct ? 'Edit Product' : 'Create Product'}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="product_name" label="Product Name" rules={[{ required: true, message: 'Please input product name!' }]}> 
            <Input placeholder="Product Name" className="glassmorphism-input" /> 
          </Form.Item>

          <Form.Item name="category_id" label="Category" rules={[{ required: true, message: 'Please select a category!' }]}> 
            <Select placeholder="Select Category" className="glassmorphism-input">
              {categories.map((cat) => (
                <Option key={cat.category_id} value={cat.category_id}>{cat.category_name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please input price!' }]}> 
            <InputNumber min={0} max={999999999} className="w-full" placeholder="Price" />
          </Form.Item>

          <Form.Item name="stock_quantity" label="Stock Quantity" rules={[{ required: true, message: 'Please input stock quantity!' }]}> 
            <InputNumber min={1} max={10000} className="w-full" placeholder="Stock Quantity" />
          </Form.Item>

          <Form.Item name="available_for_sale" label="Available for Sale" valuePropName="checked"> 
            <input type="checkbox" className="glassmorphism-input" /> 
          </Form.Item>

          <Form.Item name="description" label="Description"> 
            <Input.TextArea rows={4} placeholder="Description" className="glassmorphism-input" /> 
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductManagerPage;
