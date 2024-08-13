// src/pages/ProductAnalytics.js
import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

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

const ProductAnalytics = ({ data }) => {
  const mostReviewedProductsData = {
    labels: data.most_reviewed_products.map(item => item.product__name),
    datasets: [
      {
        label: 'بیشترین نقد و بررسی محصولات',
        data: data.most_reviewed_products.map(item => item.total_reviews),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const highestRatedProductsData = {
    labels: data.highest_rated_products.map(item => item.name),
    datasets: [
      {
        label: 'محصولات با بالاترین امتیاز',
        data: data.highest_rated_products.map(item => item.avg_rating),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const lowestRatedProductsData = {
    labels: data.lowest_rated_products.map(item => item.name),
    datasets: [
      {
        label: 'محصولات با کمترین امتیاز',
        data: data.lowest_rated_products.map(item => item.avg_rating),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const featuredProductsPerformanceData = {
    labels: data.featured_products_performance.map(item => item.name),
    datasets: [
      {
        label: 'عملکرد محصولات ویژه',
        data: data.featured_products_performance.map(item => item.total_sales),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const goldPriceTrendsData = {
    labels: data.gold_price_trends.map(item => new Date(item.date).toLocaleDateString('fa-IR')),
    datasets: [
      {
        label: 'روند قیمت طلا',
        data: data.gold_price_trends.map(item => item.avg_price),
        backgroundColor: 'rgba(255, 206, 86, 0.6)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <Row className="mb-4">
      <Col xs={12} md={6} className="mb-4">
        <div className="shadow-sm p-4 bg-white rounded border text-center">
          <h4 className="text-primary mb-3">کل محصولات</h4>
          <p className="lead">{data.total_products}</p>
        </div>
      </Col>
      <Col xs={12} md={6} className="mb-4">
        <div className="shadow-sm p-4 bg-white rounded border text-center">
          <h4 className="text-primary mb-3">محصولات موجود</h4>
          <p className="lead">{data.available_products}</p>
        </div>
      </Col>
      <Col xs={12} className="mt-4">
        <div className="shadow-sm p-4 bg-white rounded border">
          <h4 className="text-primary mb-3">بیشترین نقد و بررسی محصولات</h4>
          <Bar data={mostReviewedProductsData} />
        </div>
      </Col>
      <Col xs={12} className="mt-4">
        <div className="shadow-sm p-4 bg-white rounded border">
          <h4 className="text-primary mb-3">محصولات با بالاترین امتیاز</h4>
          <Bar data={highestRatedProductsData} />
        </div>
      </Col>
      <Col xs={12} className="mt-4">
        <div className="shadow-sm p-4 bg-white rounded border">
          <h4 className="text-primary mb-3">محصولات با کمترین امتیاز</h4>
          <Bar data={lowestRatedProductsData} />
        </div>
      </Col>
      <Col xs={12} className="mt-4">
        <div className="shadow-sm p-4 bg-white rounded border">
          <h4 className="text-primary mb-3">عملکرد محصولات ویژه</h4>
          <Bar data={featuredProductsPerformanceData} />
        </div>
      </Col>
      <Col xs={12} className="mt-4">
        <div className="shadow-sm p-4 bg-white rounded border">
          <h4 className="text-primary mb-3">روند قیمت طلا</h4>
          <Line data={goldPriceTrendsData} />
        </div>
      </Col>
    </Row>
  );
};

export default ProductAnalytics;
