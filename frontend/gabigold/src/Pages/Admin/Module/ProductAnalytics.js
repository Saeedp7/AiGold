// src/pages/ProductAnalytics.js
import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement } from 'chart.js'; // Import ArcElement
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
      <Col xs={6}>
        <Card>
          <Card.Body>
            <Card.Title>کل محصولات</Card.Title>
            <Card.Text>{data.total_products}</Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col xs={6}>
        <Card>
          <Card.Body>
            <Card.Title>محصولات موجود</Card.Title>
            <Card.Text>{data.available_products}</Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col xs={10} className="mt-4">
        <Card>
          <Card.Body>
            <Card.Title>بیشترین نقد و بررسی محصولات</Card.Title>
            <Bar data={mostReviewedProductsData} />
          </Card.Body>
        </Card>
      </Col>
      <Col xs={10} className="mt-4">
        <Card>
          <Card.Body>
            <Card.Title>محصولات با بالاترین امتیاز</Card.Title>
            <Bar data={highestRatedProductsData} />
          </Card.Body>
        </Card>
      </Col>
      <Col xs={10} className="mt-4">
        <Card>
          <Card.Body>
            <Card.Title>محصولات با کمترین امتیاز</Card.Title>
            <Bar data={lowestRatedProductsData} />
          </Card.Body>
        </Card>
      </Col>
      <Col xs={10} className="mt-4">
        <Card>
          <Card.Body>
            <Card.Title>عملکرد محصولات ویژه</Card.Title>
            <Bar data={featuredProductsPerformanceData} />
          </Card.Body>
        </Card>
      </Col>
      <Col xs={10} className="mt-4">
        <Card>
          <Card.Body>
            <Card.Title>روند قیمت طلا</Card.Title>
            <Line data={goldPriceTrendsData} />
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default ProductAnalytics;
