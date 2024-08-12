import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Row, Col, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';


const NotAuthorized = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <Container className="not-authorized-container">
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="text-center shadow-sm border-0">
                        <Card.Body>
                            <FontAwesomeIcon icon={faLock} size="4x" className="text-warning mb-3" />
                            <h1 className="display-4">دسترسی غیرمجاز</h1>
                            <p className="lead">متاسفانه شما مجاز به دسترسی به این صفحه نیستید.</p>
                            <Button variant="primary" onClick={handleGoHome}>
                                بازگشت به صفحه اصلی
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default NotAuthorized;
