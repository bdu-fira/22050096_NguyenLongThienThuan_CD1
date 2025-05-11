import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Space,
  Popconfirm,
  message,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import orderService from '../../services/orderService';

const CustomerTypesManager = () => {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await orderService.fetchCustomerTypes();
      setTypes(data);
    } catch (err) {
      message.error('Lỗi tải loại khách hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpen = (record = null) => {
    setEditingId(record?.customer_type_id || null);
    if (record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
    }
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await orderService.deleteCustomerType(id);
      message.success('Đã xoá thành công');
      fetchData();
    } catch (err) {
      message.error('Xoá thất bại');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingId) {
        await orderService.updateCustomerType(editingId, values);
        message.success('Cập nhật thành công');
      } else {
        await orderService.createCustomerType(values);
        message.success('Thêm mới thành công');
      }
      setOpen(false);
      fetchData();
    } catch (err) {
      message.error('Lỗi xử lý');
    }
  };

  const columns = [
    {
      title: 'Tên loại KH',
      dataIndex: 'name',
    },
    {
      title: 'Tỉ lệ chiết khấu (%)',
      dataIndex: 'rate_type',
    },
    {
      title: 'Hành động',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleOpen(record)}>Sửa</Button>
          <Popconfirm
            title="Bạn có chắc muốn xoá?"
            onConfirm={() => handleDelete(record.customer_type_id)}
          >
            <Button icon={<DeleteOutlined />} danger>Xoá</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Quản lý loại khách hàng</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpen()}>Thêm</Button>
      </div>

      <Table rowKey="customer_type_id" loading={loading} columns={columns} dataSource={types} />

      <Modal
        title={editingId ? 'Cập nhật loại KH' : 'Thêm loại KH'}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleSubmit}
        okText={editingId ? 'Cập nhật' : 'Thêm mới'}
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="name" label="Tên loại KH" rules={[{ required: true, message: 'Không được để trống' }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="rate_type" label="Tỉ lệ chiết khấu (%)" rules={[{ required: true }]}> 
            <InputNumber min={0} max={100} className="w-full" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CustomerTypesManager;
