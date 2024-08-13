// src/pages/SalesAnalytics.js
import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement } from 'chart.js';
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
      <Col xs={12} md={6} className="mb-4">
        <div className="shadow-sm p-4 bg-white rounded border text-center">
          <h4 className="text-primary mb-3">فروش کل</h4>
          <p className="lead">{Math.round(data.total_sales).toLocaleString("fa-IR")} تومان</p>
        </div>
      </Col>
      <Col xs={12} md={8} className="mb-4">
        <div className="shadow-sm p-4 bg-white rounded border text-center">
          <h4 className="text-primary mb-3">میانگین ارزش سفارش</h4>
          <p className="lead">{Math.round(data.average_order_value).toLocaleString("fa-IR")} تومان</p>
        </div>
      </Col>
      <Col xs={12} className="mt-4">
        <div className="shadow-sm p-4 bg-white rounded border">
          <h4 className="text-primary mb-3">فروش در طول زمان</h4>
          <Line data={salesOverTimeData} />
        </div>
      </Col>
      <Col xs={12} className="mt-4">
        <div className="shadow-sm p-4 bg-white rounded border">
          <h4 className="text-primary mb-3">فروش بر اساس دسته‌بندی</h4>
          <Bar data={salesByCategoryData} />
        </div>
      </Col>
    </Row>
  );
};

export default SalesAnalytics;
