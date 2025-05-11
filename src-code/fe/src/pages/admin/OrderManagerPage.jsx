import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployeeOrders } from '../../redux/slices/orderSlice';
import { Table, Button } from 'antd';
import OrderCard from '../../components/OrderCard';
import AdminLayout from '../../components/AdminLayout';

const OrderManagerPage = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchEmployeeOrders());
  }, [dispatch]);

  if (loading) {
    return <AdminLayout><div className="text-center">Loading orders...</div></AdminLayout>;
  }

  if (error) {
    return <AdminLayout><div className="text-center text-red-500">Error: {error}</div></AdminLayout>;
  }

  return (
    <div className="container mx-auto py-8">
    <h1 className="text-2xl font-semibold mb-4 text-gray-800">Order Management</h1>
    <div className="grid gap-4">
      {orders && orders.map((order) => (
        <OrderCard key={order.order_id} order={order} />
      ))}
    </div>
  </div>
  );
};

export default OrderManagerPage;