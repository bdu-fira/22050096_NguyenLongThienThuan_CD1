import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPromotions } from '../../redux/slices/promotionSlice';
import PromotionCard from '../../components/PromotionCard';
import { Row, Col, Spin } from 'antd';
import { Link } from 'react-router-dom';

const PromotionListPage = () => {
  const dispatch = useDispatch();
  const { promotions, loading, error } = useSelector((state) => state.promotion);
  console.log(promotions);
  
  useEffect(() => {
    dispatch(fetchPromotions());
    
  }, [dispatch]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-semibold mb-6 text-center">Promotions</h1>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Spin size="large" />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">Error: {error}</div>
      ) : (
        <Row gutter={[24, 24]}>
          {promotions.map((promotion) => (
            <Col xs={24} sm={12} md={8} lg={6} key={promotion.promo_id}>
              <PromotionCard promotion={promotion} />
            </Col>
          ))}
        </Row>
      )}

    </div>
  );
};

export default PromotionListPage;