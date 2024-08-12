// src/pages/OrderAnalytics.js
import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { Doughnut } from 'react-chartjs-2';

// Utility function to convert seconds to months, days, hours, and minutes
const formatProcessingTime = (seconds) => {
  const months = Math.floor(seconds / (30 * 24 * 60 * 60)); // Assuming 30 days per month
  seconds %= (30 * 24 * 60 * 60);
  const days = Math.floor(seconds / (24 * 60 * 60));
  seconds %= (24 * 60 * 60);
  const hours = Math.floor(seconds / (60 * 60));
  seconds %= (60 * 60);
  const minutes = Math.floor(seconds / 60);

  return `${months > 0 ? months + ' ماه ' : ''}${days > 0 ? days + ' روز ' : ''}${hours > 0 ? hours + ' ساعت ' : ''}${minutes > 0 ? minutes + ' دقیقه' : ''}`;
};

const OrderAnalytics = ({ data }) => {
  const orderStatusDistributionData = {
    labels: data.order_status_distribution.map(item => translateStatus(item.status)),
    datasets: [
      {
        data: data.order_status_distribution.map(item => item.count),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      },
    ],
  };

  return (
    <Row className="mb-4">
      <Col xs={6}>
        <Card>
          <Card.Body>
            <Card.Title>کل سفارشات</Card.Title>
            <Card.Text>{data.total_orders}</Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col xs={6}>
        <Card>
          <Card.Body>
            <Card.Title>میانگین زمان پردازش سفارش</Card.Title>
            <Card.Text>{formatProcessingTime(data.average_order_processing_time)}</Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col xs={10} className="mt-4">
        <Card>
          <Card.Body>
            <Card.Title>توزیع وضعیت سفارشات</Card.Title>
            <Doughnut data={orderStatusDistributionData} />
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

const translateStatus = (status) => {
  const translations = {
    'PROCESSING': 'در حال پردازش',
    'PENDING': 'در انتظار',
    'SHIPPED': 'ارسال شده',
    'COMPLETED': 'تکمیل شده',
    'DELIVERED': 'تحویل داده شده',
  };
  return translations[status] || status;
};

export default OrderAnalytics;
