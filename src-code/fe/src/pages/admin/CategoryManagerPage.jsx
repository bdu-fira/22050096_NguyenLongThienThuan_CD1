import React, { useEffect, useState } from 'react';
import {
  Table, Button, Modal, Form, Input, Popconfirm, message, Space
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import orderService from '../../services/orderService';

const CategoryManagerPage = () => {
  const [categories, setCategories] = useState([]);
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await orderService.fetchCatagory();
      setCategories(data);
    } catch (err) {
      message.error('Không thể tải danh sách danh mục.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEditModal = (record) => {
    setEditingCategory(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await orderService.deleteCategory(id);
      message.success('Xoá danh mục thành công.');
      fetchData();
    } catch {
      message.error('Không thể xoá danh mục.');
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingCategory) {
        await orderService.updateCategory(editingCategory.category_id, values);
        message.success('Cập nhật danh mục thành công.');
      } else {
        await orderService.createCategory(values);
        message.success('Thêm danh mục thành công.');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      message.error('Vui lòng kiểm tra lại thông tin.');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'category_id',
      key: 'category_id',
    },
    {
      title: 'Tên danh mục',
      dataIndex: 'category_name',
      key: 'category_name',
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => openEditModal(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xoá danh mục này?"
            onConfirm={() => handleDelete(record.category_id)}
            okText="Xoá"
            cancelText="Huỷ"
          >
            <Button type="link" danger>Xoá</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Quản lý danh mục sản phẩm</h2>
        <Button type="" icon={<PlusOutlined />} onClick={openCreateModal}>
          Thêm danh mục
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={categories}
        rowKey="category_id"
        loading={loading}
        bordered
        className="rounded-lg"
      />

      <Modal
        title={editingCategory ? 'Cập nhật danh mục' : 'Thêm danh mục'}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        okText='Lưu'
        cancelText="Huỷ"
        
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="category_name"
            label="Tên danh mục"
            rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}
          >
            <Input placeholder="Nhập tên danh mục..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryManagerPage;
