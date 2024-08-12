// src/pages/UserAnalytics.js
import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { Line, Doughnut } from 'react-chartjs-2';

const UserAnalytics = ({ data }) => {
  const newUsersOverTimeData = {
    labels: data.new_users_over_time.map(item => new Date(item.date).toLocaleDateString('fa-IR')),
    datasets: [
      {
        label: 'کاربران جدید در طول زمان',
        data: data.new_users_over_time.map(item => item.new_users),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const genderDistributionData = {
    labels: data.user_registration_by_gender.map(item => item.gender),
    datasets: [
      {
        data: data.user_registration_by_gender.map(item => item.total),
        backgroundColor: ['#FF6384', '#36A2EB'],
      },
    ],
  };

  return (
    <Row className="mb-4">
      <Col xs={6}>
        <Card>
          <Card.Body>
            <Card.Title>کل کاربران</Card.Title>
            <Card.Text>{data.total_users}</Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col xs={6}>
        <Card>
          <Card.Body>
            <Card.Title>نرخ حفظ کاربر</Card.Title>
            <Card.Text>{data.user_retention_rate}%</Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col xs={10} className="mt-4">
        <Card>
          <Card.Body>
            <Card.Title>کاربران جدید در طول زمان</Card.Title>
            <Line data={newUsersOverTimeData} />
          </Card.Body>
        </Card>
      </Col>
      <Col xs={10} className="mt-4">
        <Card>
          <Card.Body>
            <Card.Title>توزیع کاربران بر اساس جنسیت</Card.Title>
            <Doughnut data={genderDistributionData} />
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default UserAnalytics;
