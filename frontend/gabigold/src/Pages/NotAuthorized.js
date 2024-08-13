import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

const NotAuthorized = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <Container className="not-authorized-container my-5">
            <Row className="justify-content-center">
                <Col md={8}>
                    <div className="text-center shadow-sm p-5 bg-white rounded border">
                        <FontAwesomeIcon icon={faLock} size="4x" className="text-warning mb-3" />
                        <h1 className="display-4 text-danger mb-3">دسترسی غیرمجاز</h1>
                        <p className="lead text-muted mb-4">متاسفانه شما مجاز به دسترسی به این صفحه نیستید.</p>
                        <Button variant="primary" onClick={handleGoHome}>
                            بازگشت به صفحه اصلی
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default NotAuthorized;
