import React, { useEffect, useState } from 'react';
import { Table, Tag, Select, message, Spin } from 'antd';
import orderService from '../../services/orderService';

const { Option } = Select;

const CustomersListPage = () => {
  const [customers, setCustomers] = useState([]);
  const [customerTypes, setCustomerTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customerRes, typeRes] = await Promise.all([
          orderService.fetchCustomer(), // giả sử endpoint lấy tất cả khách hàng
          orderService.fetchCustomerTypes()
        ]);

        setCustomers(customerRes);
        setCustomerTypes(typeRes);
      } catch (error) {
        message.error('Lỗi khi tải dữ liệu khách hàng hoặc loại khách hàng.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChangeType = async (customerId, typeId) => {
    try {
      const customer = customers.find(c => c.customer_id === customerId);
      const updated = await orderService.updateCustomer(customerId, {
        ...customer,
        customer_type_id: typeId
      });
      setCustomers((prev) => prev.map(c => c.customer_id === customerId ? updated : c));
      message.success('Cập nhật loại khách hàng thành công.');
    } catch (error) {
      console.error(error);
      message.error('Lỗi khi cập nhật loại khách hàng.');
    }
  };

  const columns = [
    {
      title: 'Tên khách hàng',
      dataIndex: 'customer_name',
      key: 'customer_name',
    },
    {
      title: 'Email',
      dataIndex: 'primary_email',
      key: 'primary_email',
    },
    {
      title: 'Liên hệ',
      dataIndex: 'contact_person',
      key: 'contact_person',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Loại khách hàng',
      dataIndex: 'customer_type_id',
      key: 'customer_type_id',
      render: (typeId, record) => (
        <Select
          value={typeId}
          style={{ width: 160 }}
          onChange={(value) => handleChangeType(record.customer_id, value)}
        >
          {customerTypes.map(type => (
            <Option key={type.customer_type_id} value={type.customer_type_id}>
              {type.name}
            </Option>
          ))}
        </Select>
      )
    }
  ];

  return (
    <div className="container mx-auto py-6 px-4 font-[Quicksand]">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Danh sách khách hàng</h2>
      {loading ? (
        <div className="text-center">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          rowKey="customer_id"
          columns={columns}
          dataSource={customers}
          bordered
          className="bg-white rounded-xl shadow"
        />
      )}
    </div>
  );
};

export default CustomersListPage;
