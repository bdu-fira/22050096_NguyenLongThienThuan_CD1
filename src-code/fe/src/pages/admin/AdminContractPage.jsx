import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContracts } from '../../redux/slices/contractSlice';
import { Table } from 'antd';
import ContractCard from '../../components/ContractCard';
import AdminLayout from '../../components/AdminLayout';

const AdminContractPage = () => {
  const dispatch = useDispatch();
  const { contracts, loading, error } = useSelector((state) => state.contract);

  useEffect(() => {
    dispatch(fetchContracts());
  }, [dispatch]);

  if (loading) {
    return <div className="text-center">Loading contracts...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto py-8">
    <h1 className="text-2xl font-semibold mb-4 text-gray-800">Contract Management</h1>
    <div className="grid gap-4">
      {contracts && contracts.map((contract) => (
        <ContractCard key={contract.contract_id} contract={contract} />
      ))}
    </div>
  </div>
  );
};

export default AdminContractPage;