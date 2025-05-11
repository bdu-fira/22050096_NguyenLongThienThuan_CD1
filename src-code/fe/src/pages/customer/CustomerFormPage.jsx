import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createCustomer } from '../../redux/slices/customerSlice';
import CustomerForm from '../../components/CustomerForm';
import useAuth from '../../components/AuthWrapper';
import { Button, Result } from 'antd';

const CustomerFormPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {customer} = useSelector((state)=>state.customer);

  const handleCreateCustomer = async (data) => {
    try {
      await dispatch(createCustomer(data)).unwrap();
      navigate('/customer/info');
    } catch (error) {
      console.error('Failed to create customer:', error);
    }
  };

  if (customer) {
    return (
      <Result
        status="success"
        title="Thông tin khách hàng đã được tạo!"
        subTitle="Bạn đã có thông tin khách hàng. Vui lòng xem thông tin chi tiết."
        extra={[
          <Button type="primary" key="info" onClick={() => navigate('/customer-info')}>
            Xem thông tin
          </Button>
        ]}
      />
    );
  }

  return (
    <CustomerForm  onSubmit={handleCreateCustomer} />
  );
};

export default CustomerFormPage;