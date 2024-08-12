import React, { useEffect, useState } from 'react';
import { Row, Col, Card, ListGroup } from 'react-bootstrap';
import axiosInstance from '../../components/utils/axiosinterceptor';
import { useParams } from 'react-router-dom';
import { BACKEND_URL } from '../../components/utils/api';
import { toast } from 'react-toastify';

const OrderDetails = () => {
    const { transaction_id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = sessionStorage.getItem('access_token') || localStorage.getItem('access_token');

    useEffect(() => {
        async function fetchOrderDetails() {
            try {
                const response = await axiosInstance.get(`${BACKEND_URL}/cart/orders/${transaction_id}/`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                setOrder(response.data);
                setLoading(false);
            } catch (error) {
                toast.error('مشکلی در بارگزاری رخ داده است', {
                    position: "top-left",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "colored"
                });
                setLoading(false);
            }
        }
        fetchOrderDetails();
    }, [transaction_id, token]);

    return (
        <div className="padding-general navDistance">
            <Row>
                <Col className='mb-5 col-12'>
                    {loading ? (
                        <p>بارگذاری...</p>
                    ) : (
                        <Card>
                            <Card.Body>
                                <Card.Title>سفارش {order.transaction_id}</Card.Title>
                                <Card.Text>
                                    مبلغ کل: {order.total_price} تومان
                                    <br />
                                    وضعیت: {order.status}
                                    <br />
                                    آدرس: {order.address}
                                    <br />
                                    اطلاعات تماس: {order.contact_info}
                                </Card.Text>
                                <h4>موارد سفارش:</h4>
                                <ListGroup>
                                    {order.items.map(item => (
                                        <ListGroup.Item key={item.id}>
                                            <strong>{item.product.name}</strong> - {item.price} تومان
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default OrderDetails;
