import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button, DatePicker, message } from 'antd';
import moment from 'moment';
import { createContract } from '../../redux/slices/contractSlice';
import { fetchOrderById } from '../../redux/slices/orderSlice';
import MainLayout from '../../layouts/MainLayout';

const { TextArea } = Input;

const CreateContractPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orderId } = useParams();
  const { currentOrder, loading, error } = useSelector((state) => state.order);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchOrderById(orderId));
  }, [dispatch, orderId]);

  const onFinish = (values) => {
    const contractData = {
      order_id: parseInt(orderId),
      contract_date: values.contract_date.format('YYYY-MM-DD'),
      contract_details: values.contract_details,
      final_amount: currentOrder.final_amount,
      contract_status: 'pending', // Default status
    };

    dispatch(createContract(contractData))
      .unwrap()
      .then((result) => {
        message.success('Contract created successfully!');
        navigate(`/contracts/${result.contract_id}`);
      })
      .catch((error) => {
        message.error('Failed to create contract: ' + error.message);
      });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
  }

  if (!currentOrder) {
    return <div className="flex justify-center items-center h-screen text-red-500">Order not found.</div>;
  }

  if (currentOrder.order_status !== 'quoted') {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Order status is not 'quoted'. Cannot create contract.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
        <div className="glassmorphism-card">
          <h2 className="text-2xl font-semibold mb-4">Create Contract</h2>
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Contract Date"
              name="contract_date"
              rules={[{ required: true, message: 'Please select contract date!' }]}
            >
              <DatePicker className="w-full glassmorphism-input"/>
            </Form.Item>

            <Form.Item
              label="Contract Details"
              name="contract_details"
              rules={[{ required: true, message: 'Please enter contract details!' }]}
            >
              <TextArea rows={4} className="glassmorphism-input"/>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="glassmorphism-button">
                Create Contract
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
  );
};

export default CreateContractPage;
