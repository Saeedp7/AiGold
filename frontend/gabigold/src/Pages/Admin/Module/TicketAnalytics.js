// src/pages/TicketAnalytics.js
import React from 'react';
import { Row, Col } from 'react-bootstrap';
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
            <Col xs={12} md={6} className="mb-4">
                <div className="shadow-sm p-4 bg-white rounded border text-center">
                    <h4 className="text-primary mb-3">کل تیکت‌ها</h4>
                    <p className="lead">{data.total_tickets}</p>
                </div>
            </Col>
            <Col xs={12} md={8} className="mb-4">
                <div className="shadow-sm p-4 bg-white rounded border text-center">
                    <h4 className="text-primary mb-3">میانگین زمان حل تیکت‌ها</h4>
                    <p className="lead">{formatProcessingTime(data.average_ticket_resolution_time)}</p>
                </div>
            </Col>
            <Col xs={12} className="mt-4">
                <div className="shadow-sm p-4 bg-white rounded border">
                    <h4 className="text-primary mb-3">تعداد تیکت‌ها در طول زمان</h4>
                    <Line data={ticketsOverTimeData} />
                </div>
            </Col>
            <Col xs={12} className="mt-4">
                <div className="shadow-sm p-4 bg-white rounded border">
                    <h4 className="text-primary mb-3">توزیع وضعیت تیکت‌ها</h4>
                    <Doughnut data={ticketStatusDistributionData} />
                </div>
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
