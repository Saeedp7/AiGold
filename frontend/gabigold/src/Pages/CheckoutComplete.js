import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosInstance from "../components/utils/axiosinterceptor";
import { BACKEND_URL } from "../components/utils/api";
import { toast } from "react-toastify";
import { ListGroup, Row, Col } from "react-bootstrap";
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
                if (response.status === 200) {
                    setOrder(response.data);
                    setPaymentStatus('success');
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
    }, [authority, status, token, navigate, dispatchAction]);

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
            <Row className="justify-content-center">
                <Col md={8} className="mb-5">
                    <h3 className="mb-3 text-center text-primary">جزئیات سفارش شما</h3>
                    <div className="shadow-sm p-4 bg-white rounded border mb-4">
                        <h4 className="text-center text-success">سفارش {order.order_data.transaction_id}</h4>
                        <p className="text-center text-muted">پرداخت موفقیت‌آمیز بود!</p>
                        <div className="order-details p-3 mt-4 bg-light rounded">
                            <p><strong>مبلغ کل:</strong> {order.order_data.total_price} تومان</p>
                            <p><strong>وضعیت:</strong> {order.order_data.status}</p>
                            <p><strong>آدرس:</strong> {order.order_data.address}</p>
                            <p><strong>اطلاعات تماس:</strong> {order.order_data.contact_info}</p>
                        </div>
                    </div>
                    <h4 className="mt-4 text-center text-primary">محصولات شما</h4>
                    <ListGroup className="shadow-sm rounded border">
                        {order.order_data.items.map(item => (
                            <ListGroup.Item key={item.id} className="mb-2 p-3">
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
                                        <h5 className="mb-0 text-primary">{item.product.name}</h5>
                                        <p className="mb-0 text-muted">قیمت: {item.price} تومان</p>
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
