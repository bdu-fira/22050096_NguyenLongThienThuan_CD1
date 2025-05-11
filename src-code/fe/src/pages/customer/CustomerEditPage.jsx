import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchCustomerByUser, updateCustomer } from '../../redux/slices/customerSlice';
import CustomerForm from '../../components/CustomerForm';
import { Button, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const CustomerEditPage = () => {
  const { customerId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { customer, loading, error } = useSelector((state) => state.customer);
  const {user} = useSelector((state)=>state.auth);

  useEffect(() => {
    if (customerId) {
      dispatch(fetchCustomerByUser(user?.iduser));
    }
  }, [customerId, dispatch, user?.iduser]);

  const handleSubmit = async (formData) => {
    try {
      const iduser = user?.iduser
      await dispatch(updateCustomer({ id: iduser, data: formData })).unwrap();
      message.success('Customer information updated successfully.');
      navigate('/customer/info');
    } catch (error) {
      message.error('Failed to update customer information.');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
    </div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/customer-info')}>Quay về trang thông tin</Button>
      </div>
      <div className="bg-white/30 backdrop-blur-sm rounded-lg shadow-md p-8 border border-gray-200/50">
        {customer && <CustomerForm initialValues={customer} onSubmit={handleSubmit} loading={loading} />}
      </div>
    </div>
  );
};

export default CustomerEditPage;