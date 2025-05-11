import React from 'react';
import { Card } from 'antd';
import { useNavigate } from 'react-router-dom';

const ContractCard = ({ contract }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    // Navigate to the contract detail page
    navigate(`/contract-detail/${contract.contract_id}`);
  };

  return (
    <Card
      title={`Contract ID: ${contract.contract_id}`}
      onClick={handleCardClick}
      className="glassmorphism-card hover:shadow-lg transition duration-300"
      style={{ marginBottom: '16px' }}
    >
      <p>Contract Date: {new Date(contract.contract_date).toLocaleDateString()}</p>
      <p>Total Amount: ${contract.final_amount}</p>
      <p>Status: {contract.contract_status}</p>
    </Card>
  );
};

export default ContractCard;