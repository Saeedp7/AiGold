// src/pages/OrderAnalytics.js
import React from 'react';
import { Row, Col } from 'react-bootstrap';
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
      <Col xs={12} md={6} className="mb-4">
        <div className="shadow-sm p-4 bg-white rounded border text-center">
          <h4 className="text-primary mb-3">کل سفارشات</h4>
          <p className="lead">{data.total_orders}</p>
        </div>
      </Col>
      <Col xs={12} md={6} className="mb-4">
        <div className="shadow-sm p-4 bg-white rounded border text-center">
          <h4 className="text-primary mb-3">میانگین زمان پردازش سفارش</h4>
          <p className="lead">{formatProcessingTime(data.average_order_processing_time)}</p>
        </div>
      </Col>
      <Col xs={12} className="mt-4">
        <div className="shadow-sm p-4 bg-white rounded border">
          <h4 className="text-primary mb-3">توزیع وضعیت سفارشات</h4>
          <Doughnut data={orderStatusDistributionData} />
        </div>
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
