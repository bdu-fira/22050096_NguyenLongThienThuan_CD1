import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContracts } from '../../redux/slices/contractSlice';
import { List, Card, Typography, Spin } from 'antd';
import ContractCard from '../../components/ContractCard';
import { Link } from 'react-router-dom';

const ContractListPage = () => {
  const dispatch = useDispatch();
  const { contracts, loading, error } = useSelector((state) => state.contract);

  useEffect(() => {
    dispatch(fetchContracts());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Typography.Title level={2} className="text-gray-800 mb-4">Danh sách hợp đồng</Typography.Title>
      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={contracts}
        renderItem={(contract) => (
          <List.Item key={contract.contract_id}>
            <Link to={`/contracts/${contract.contract_id}`}>
              <ContractCard contract={contract} />
            </Link>
          </List.Item>
        )}
      />
    </div>
  );
};

export default ContractListPage;