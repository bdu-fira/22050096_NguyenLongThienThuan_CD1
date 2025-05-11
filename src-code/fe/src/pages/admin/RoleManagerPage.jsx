import React, { useEffect, useState } from 'react';
import { Table, Button, Input, message, Space, Modal } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import AdminLayout from '../../components/AdminLayout';
import authService from '../../services/authService';

const RoleManagerPage = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [newRoleName, setNewRoleName] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const res = await authService.fetchRoles();
      setRoles(res);
    } catch (error) {
      message.error('Failed to fetch roles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const showModal = (role = null) => {
    setEditingRole(role);
    setNewRoleName(role ? role.name : '');
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      if (editingRole) {
        await authService.updateRole({ ...editingRole, name: newRoleName });
        message.success('Role updated successfully');
      } else {
        await authService.createRole({ name: newRoleName });
        message.success('Role created successfully');
      }
      fetchRoles();
      setIsModalVisible(false);
      setNewRoleName('');
    } catch (error) {
      message.error('Failed to save role');
    }
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: 'Are you sure to delete this role?',
      onOk: async () => {
        try {
          await authService.deleteRole(id);
          message.success('Role deleted');
          fetchRoles();
        } catch (error) {
          message.error('Failed to delete role');
        }
      },
    });
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'idRole',
      key: 'idRole',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => showModal(record)} />
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.idRole)} />
        </Space>
      ),
    },
  ];

  return (
    <div className="container mx-auto py-8">
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-semibold text-white">Role Management</h1>
      <Button icon={<PlusOutlined />} type="primary" onClick={() => showModal()}>
        Add Role
      </Button>
    </div>
    <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-md overflow-hidden">
      <Table
        columns={columns}
        dataSource={roles}
        rowKey="idRole"
        loading={loading}
        pagination={{ pageSize: 8 }}
      />
    </div>

    <Modal
      title={editingRole ? 'Edit Role' : 'Create Role'}
      open={isModalVisible}
      onOk={handleOk}
      onCancel={() => setIsModalVisible(false)}
    >
      <Input
        placeholder="Role Name"
        value={newRoleName}
        onChange={(e) => setNewRoleName(e.target.value)}
      />
    </Modal>
  </div>
  );
};

export default RoleManagerPage;
