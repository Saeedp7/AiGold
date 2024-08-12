// src/pages/TicketAnalytics.js
import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { Line, Doughnut } from 'react-chartjs-2';

const TicketAnalytics = ({ data }) => {

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

  const ticketsOverTimeData = {
    labels: data.tickets_over_time.map(item => new Date(item.date).toLocaleDateString('fa-IR')),
    datasets: [
      {
        label: 'تعداد تیکت‌ها در طول زمان',
        data: data.tickets_over_time.map(item => item.total_tickets),
        backgroundColor: 'rgba(255, 206, 86, 0.6)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
      },
    ],
  };

  const ticketStatusDistributionData = {
    labels: data.ticket_status_distribution.map(item => translateStatus(item.status)),
    datasets: [
      {
        data: data.ticket_status_distribution.map(item => item.count),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  return (
    <Row className="mb-4">
      <Col xs={6}>
        <Card>
          <Card.Body>
            <Card.Title>کل تیکت‌ها</Card.Title>
            <Card.Text>{data.total_tickets}</Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col xs={8}>
        <Card>
          <Card.Body>
            <Card.Title>میانگین زمان حل تیکت‌ها</Card.Title>
            <Card.Text>{formatProcessingTime(data.average_ticket_resolution_time)}</Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col xs={10} className="mt-4">
        <Card>
          <Card.Body>
            <Card.Title>تعداد تیکت‌ها در طول زمان</Card.Title>
            <Line data={ticketsOverTimeData} />
          </Card.Body>
        </Card>
      </Col>
      <Col xs={10} className="mt-4">
        <Card>
          <Card.Body>
            <Card.Title>توزیع وضعیت تیکت‌ها</Card.Title>
            <Doughnut data={ticketStatusDistributionData} />
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

const translateStatus = (status) => {
  const translations = {
    'open': 'باز',
    'pending': 'در انتظار',
    'closed': 'بسته شده',
  };
  return translations[status] || status;
};

export default TicketAnalytics;
