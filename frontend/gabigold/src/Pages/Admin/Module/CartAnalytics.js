// src/pages/CartAnalytics.js
import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';

const CartAnalytics = ({ data }) => {
  const mostAddedToCartProductsData = {
    labels: data.most_added_to_cart_products.map(item => item.product__name),
    datasets: [
      {
        label: 'بیشترین اضافه شده به سبد خرید',
        data: data.most_added_to_cart_products.map(item => item.total_added),
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <Row className="mb-4">
      <Col xs={12} md={6} className="mb-4">
        <div className="shadow-sm p-4 bg-white rounded border text-center">
          <h4 className="text-primary mb-3">نرخ تبدیل</h4>
          <p className="lead">{data.conversion_rate}%</p>
        </div>
      </Col>
      <Col xs={12} md={6} className="mb-4">
        <div className="shadow-sm p-4 bg-white rounded border">
          <h4 className="text-primary mb-3">بیشترین محصولات اضافه شده به سبد خرید</h4>
          <Bar data={mostAddedToCartProductsData} />
        </div>
      </Col>
    </Row>
  );
};

export default CartAnalytics;
