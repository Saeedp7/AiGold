// src/pages/UserAnalytics.js
import React from 'react';
import { Row, Col } from 'react-bootstrap';
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
      <Col xs={12} md={6} className="mb-4">
        <div className="shadow-sm p-4 bg-white rounded border text-center">
          <h4 className="text-primary mb-3">کل کاربران</h4>
          <p className="lead">{data.total_users}</p>
        </div>
      </Col>
      <Col xs={12} md={6} className="mb-4">
        <div className="shadow-sm p-4 bg-white rounded border text-center">
          <h4 className="text-primary mb-3">نرخ حفظ کاربر</h4>
          <p className="lead">{data.user_retention_rate}%</p>
        </div>
      </Col>
      <Col xs={12} className="mt-4">
        <div className="shadow-sm p-4 bg-white rounded border">
          <h4 className="text-primary mb-3">کاربران جدید در طول زمان</h4>
          <Line data={newUsersOverTimeData} />
        </div>
      </Col>
      <Col xs={12} className="mt-4">
        <div className="shadow-sm p-4 bg-white rounded border">
          <h4 className="text-primary mb-3">توزیع کاربران بر اساس جنسیت</h4>
          <Doughnut data={genderDistributionData} />
        </div>
      </Col>
    </Row>
  );
};

export default UserAnalytics;
