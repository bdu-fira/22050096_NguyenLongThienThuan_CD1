import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { fetchContractById } from '../../redux/slices/contractSlice';
import { Card, Typography, Spin, Button } from 'antd';

const ContractDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentContract, loading, error } = useSelector((state) => state.contract);

  useEffect(() => {
    dispatch(fetchContractById(id));
  }, [dispatch, id]);

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

  if (!currentContract) {
    return <div>Không tìm thấy hợp đồng.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card
        title={<Typography.Title level={2} className="text-gray-800">Chi tiết hợp đồng</Typography.Title>}
        className="glassmorphism-card"
      >
        <Typography.Paragraph><strong>Mã hợp đồng:</strong> {currentContract.contract_id}</Typography.Paragraph>
        <Typography.Paragraph><strong>Ngày tạo:</strong> {currentContract.contract_date}</Typography.Paragraph>
        <Typography.Paragraph><strong>Trạng thái:</strong> {currentContract.contract_status}</Typography.Paragraph>
        <Typography.Paragraph><strong>Tổng giá trị:</strong> {currentContract.final_amount}</Typography.Paragraph>
        <Typography.Paragraph><strong>Chi tiết:</strong> {currentContract.contract_details}</Typography.Paragraph>
        <Link to="/contracts">
          <Button type="primary">Về danh sách hợp đồng</Button>
        </Link>
      </Card>
    </div>
  );
};

export default ContractDetailPage;