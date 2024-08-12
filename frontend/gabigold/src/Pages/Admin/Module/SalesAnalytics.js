// src/pages/SalesAnalytics.js
import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement } from 'chart.js'; // Import ArcElement
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    ArcElement 
  );

const SalesAnalytics = ({ data }) => {
  const salesOverTimeData = {
    labels: data.sales_over_time.map(item => new Date(item.date).toLocaleDateString('fa-IR')),
    datasets: [
      {
        label: 'فروش در طول زمان',
        data: data.sales_over_time.map(item => item.total_sales),
        backgroundColor: 'rgba(75, 192, 192, 0.4)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const salesByCategoryData = {
    labels: data.sales_by_category.map(item => item.product__category__name),
    datasets: [
      {
        label: 'فروش بر اساس دسته‌بندی',
        data: data.sales_by_category.map(item => item.total_sales),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <Row className="mb-4">
      <Col xs={6}>
        <Card>
          <Card.Body>
            <Card.Title>فروش کل</Card.Title>
            <Card.Text>{Math.round(data.total_sales).toLocaleString("fa-IR")} تومان</Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col xs={8}>
        <Card>
          <Card.Body>
            <Card.Title>میانگین ارزش سفارش</Card.Title>
            <Card.Text>{Math.round(data.average_order_value).toLocaleString("fa-IR")} تومان</Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col xs={10} className="mt-4">
        <Card>
          <Card.Body>
            <Card.Title>فروش در طول زمان</Card.Title>
            <Line data={salesOverTimeData} />
          </Card.Body>
        </Card>
      </Col>
      <Col xs={10} className="mt-4">
        <Card>
          <Card.Body>
            <Card.Title>فروش بر اساس دسته‌بندی</Card.Title>
            <Bar data={salesByCategoryData} />
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default SalesAnalytics;
