import React from 'react'
import { Card } from 'antd'

const PromotionCard = ({ promotion }) => {
  const {
    promo_id,
    promo_name,
    discount_value,
    start_date,
    end_date,
    promo_code,
    promotion_details_id,
  } = promotion || {};

  const startDateFormatted = start_date ? new Date(start_date).toLocaleDateString() : 'N/A';
  const endDateFormatted = end_date ? new Date(end_date).toLocaleDateString() : 'N/A';

  return (
    <Card
      title={promo_name}
      style={{ 
        width: 300, 
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(5px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px'
      }}
    >
      <p>Giá trị giảm: {discount_value}</p>
      <p>Thời gian: {startDateFormatted} - {endDateFormatted}</p>
      <p>Mã khuyến mãi: {promo_code}</p>
    </Card>
  );
};

export default PromotionCard;
