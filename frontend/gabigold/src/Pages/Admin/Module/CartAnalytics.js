// src/pages/CartAnalytics.js
import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
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
      <Col xs={8}>
        <Card>
          <Card.Body>
            <Card.Title>نرخ تبدیل</Card.Title>
            <Card.Text>{data.conversion_rate}%</Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col xs={8}>
        <Card>
          <Card.Body>
            <Card.Title>بیشترین محصولات اضافه شده به سبد خرید</Card.Title>
            <Bar data={mostAddedToCartProductsData} />
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default CartAnalytics;
