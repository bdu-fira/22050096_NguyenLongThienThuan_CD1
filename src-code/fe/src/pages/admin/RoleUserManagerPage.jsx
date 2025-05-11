import React, { useEffect, useState } from 'react';
import { Table, Button, Input, message, Space, Modal, Select, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import AdminLayout from '../../components/AdminLayout';
import authService from '../../services/authService';

const RoleManagerPage = () => {
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [newRoleName, setNewRoleName] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUserRoles, setSelectedUserRoles] = useState({});

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [roleRes, userRes] = await Promise.all([
        authService.fetchRoles(),
        authService.fetchUsers(),
      ]);
      setRoles(roleRes);
      setUsers(userRes);
    } catch (err) {
      message.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
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
      fetchAll();
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
          fetchAll();
        } catch (error) {
          message.error('Failed to delete role');
        }
      },
    });
  };

  const handleAssignRole = async (iduser, idRole) => {
    try {
      await authService.assignRoleToUser({ idUser:iduser, idRole });
      message.success('Assigned role');
      fetchAll();
    } catch {
      message.error('Failed to assign role');
    }
  };

  const handleRemoveRole = async (iduser, idRole) => {
    try {
      await authService.removeRoleFromUser(iduser, idRole);
      message.success('Removed role');
      fetchAll();
    } catch {
      message.error('Failed to remove role');
    }
  };

  const roleColumns = [
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

  const userColumns = [
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
      title: 'Roles',
      key: 'roles',
      render: (_, record) => (
        <Space wrap>
          {record.RoleUsers?.map((r) => (
            <Tag key={r.idRole} closable onClose={() => handleRemoveRole(record.iduser, r.idRole)}>
              {r.role?.name}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Assign Role',
      key: 'assign',
      render: (_, record) => {
        const userRoleIds = record.RoleUsers?.map(r => r.idRole) || [];
        const availableRoles = roles.filter(r => !userRoleIds.includes(r.idRole));

        return (
          <Space>
            <Select
              style={{ width: 160 }}
              placeholder="Chọn vai trò"
              onChange={(value) => setSelectedUserRoles(prev => ({ ...prev, [record.iduser]: value }))}
              options={availableRoles.map(role => ({
                value: role.idRole,
                label: role.name
              }))}
            />
            <Button onClick={() => handleAssignRole(record.iduser, selectedUserRoles[record.iduser])}>Assign</Button>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="container mx-auto py-8">

    <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-md overflow-hidden">
      <h2 className="text-white text-xl font-semibold p-4">Users and Role Assignments</h2>
      <Table
        columns={userColumns}
        dataSource={users}
        rowKey="iduser"
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
