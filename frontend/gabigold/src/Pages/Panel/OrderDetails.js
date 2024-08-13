import React, { useEffect, useState } from 'react';
import { Row, Col, ListGroup } from 'react-bootstrap';
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
                        <div className="shadow-sm p-4 bg-white rounded border">
                            <h3 className="mb-4 text-primary">سفارش {order.transaction_id}</h3>
                            <p>
                                <strong>مبلغ کل:</strong> {order.total_price} تومان
                                <br />
                                <strong>وضعیت:</strong> {order.status}
                                <br />
                                <strong>آدرس:</strong> {order.address}
                                <br />
                                <strong>اطلاعات تماس:</strong> {order.contact_info}
                            </p>
                            <h4 className="mt-4">موارد سفارش:</h4>
                            <ListGroup className="mb-4">
                                {order.items.map(item => (
                                    <ListGroup.Item key={item.id} className="border-0 p-3 bg-light mb-2">
                                        <strong>{item.product.name}</strong> - {item.price} تومان
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </div>
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default OrderDetails;
