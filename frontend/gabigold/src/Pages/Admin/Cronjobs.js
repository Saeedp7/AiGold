// src/pages/CronJobs.js
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import CronJobTrigger from '../../components/Module/CronJobTrigger';

const CronJobs = () => {
    return (
        <Container className="mt-5">
            <Row>
                <Col md={12}>
                    <h2 className="text-center">اجرای کارهای دوره‌ای</h2>
                    <CronJobTrigger />
                </Col>
            </Row>
        </Container>
    );
};

export default CronJobs;
