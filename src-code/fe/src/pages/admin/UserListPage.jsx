import React, { useEffect, useState } from 'react';
import { Table, Button, Space, message, Modal, Form, Input, Select } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import authService from '../../services/authService';

const UserListPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [userData, roleData] = await Promise.all([
        authService.fetchUsers(),
        authService.fetchRoles()
      ]);
      setUsers(userData);
      setRoles(roleData);
    } catch (err) {
      message.error('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await authService.deleteUser(id);
      message.success('Xoá người dùng thành công');
      fetchAllData();
    } catch (err) {
      message.error('Xoá thất bại');
    }
  };

  const handleCreateUser = async (values) => {
    try {
      const user = await authService.registerUser(values);
      if (values.role) {
        await authService.assignRoleToUser({ idUser: user.iduser, idRole: values.role });
      }
      message.success('Tạo người dùng thành công');
      form.resetFields();
      setIsModalOpen(false);
      fetchAllData();
    } catch (err) {
      message.error('Tạo người dùng thất bại');
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'iduser',
      key: 'iduser',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone_number',
      key: 'phone_number',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/users/edit/${record.iduser}`)}
          >
            Edit
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteUser(record.iduser)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-semibold text-white">User Management</h1>
        <Button icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
          Thêm người dùng
        </Button>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-md overflow-hidden">
        <Table
          columns={columns}
          dataSource={users}
          rowKey="iduser"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </div>

      <Modal
        title="Tạo người dùng mới"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText="Tạo"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={handleCreateUser}>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Mật khẩu" rules={[{ required: true }]}> 
            <Input.Password />
          </Form.Item>
          <Form.Item name="address" label="Địa chỉ">
            <Input />
          </Form.Item>
          <Form.Item name="phone_number" label="Số điện thoại">
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Vai trò">
            <Select placeholder="Chọn vai trò">
              {roles.map((r) => (
                <Select.Option key={r.idRole} value={r.idRole}>{r.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserListPage;
