import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosInstance from "../components/utils/axiosinterceptor";
import { BACKEND_URL } from "../components/utils/api";
import { toast } from "react-toastify";
import { Card, ListGroup, Row, Col } from "react-bootstrap";
import ApiService from "../components/utils/api";
import { useDispatch } from "react-redux";

const CheckoutComplete = () => {
    const [searchParams] = useSearchParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const authority = searchParams.get("Authority");
    const status = searchParams.get("Status");
    const token = sessionStorage.getItem('access_token') || localStorage.getItem('access_token');
    const navigate = useNavigate();
    const dispatchAction = useDispatch();

    useEffect(() => {
        if (!authority || !status) {
            toast.error('دسترسی غیرمجاز', {
                position: "top-left",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored"
            });
            navigate('/');
            return;
        }

        const fetchOrder = async () => {
            try {
                const response = await axiosInstance.get(`${BACKEND_URL}/cart/payment/verify/${authority}/`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log(response)
                console.log(response.status)
                if (response.status === 200) {
                    setOrder(response.data);
                    setPaymentStatus('success');
                    console.log("Set Shod")
                    await ApiService.clearCart(dispatchAction);
                } else {
                    setPaymentStatus('failed');
                }
            } catch (error) {
                console.error("Error fetching order details:", error);
                toast.error('مشکلی در بارگزاری جزئیات سفارش رخ داده است', {
                    position: "top-left",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "colored"
                });
                setPaymentStatus('failed');
            } finally {
                setLoading(false);
            }
        };

        if (authority && status) {
            fetchOrder();
        }
    }, [authority, status, token, navigate]);

    if (loading) {
        return <p>در حال بارگذاری...</p>;
    }

    if (paymentStatus !== 'success') {
        return <p>پرداخت ناموفق بود. لطفا دوباره تلاش کنید.</p>;
    }

    if (!order) {
        return <p>سفارشی یافت نشد</p>;
    }

    return (
        <div className="padding-general navDistance">
            <Row>
                <Col className='mb-5 col-12'>
                    <h3 className='mb-3'>جزئیات سفارش شما</h3>
                    <Card>
                        <Card.Body>
                            <Card.Title>سفارش {order.order_data.transaction_id}</Card.Title>
                            <Card.Text>
                                <strong>مبلغ کل:</strong> {order.order_data.total_price} تومان<br />
                                <strong>وضعیت:</strong> {order.order_data.status}<br />
                                <strong>آدرس:</strong> {order.order_data.address}<br />
                                <strong>اطلاعات تماس:</strong> {order.order_data.contact_info}<br />
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    <h4 className='mt-4'>محصولات</h4>
                    <ListGroup>
                        {order.order_data.items.map(item => (
                            <ListGroup.Item key={item.id}>
                                <Row className="align-items-center">
                                    <Col className="col-auto">
                                        <img 
                                            src={BACKEND_URL + item.product.thumbnail}
                                            className="rounded-3"
                                            style={{ width: "5.5rem" }}
                                            alt={item.product.name}
                                        />
                                    </Col>
                                    <Col>
                                        <h5 className="mb-0">{item.product.name}</h5>
                                        <p className="mb-0">قیمت: {item.price} تومان</p>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>
            </Row>
        </div>
    );
};

export default CheckoutComplete;
