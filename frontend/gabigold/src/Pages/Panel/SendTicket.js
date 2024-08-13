import React, { useState, useEffect } from 'react';
import axiosInstance from '../../components/utils/axiosinterceptor';
import { BACKEND_URL } from '../../components/utils/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Spinner } from 'react-bootstrap';

const SendTicket = () => {
    const [inputs, setInputs] = useState({});
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState('');
    const [attachments, setAttachments] = useState([{ id: 1, file: null }]);
    const token = sessionStorage.getItem('access_token') || localStorage.getItem('access_token');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axiosInstance.get(`${BACKEND_URL}/cart/orders/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const incompleteOrders = response.data.filter(order => order.status !== 'DELIVERED');
                setOrders(incompleteOrders);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        fetchOrders();
    }, [token]);

    const handleChange = e => {
        const name = e.target.name;
        const value = e.target.value;
        setInputs(values => ({ ...values, [name]: value }));
        if (name === 'category') {
            setCategory(value);
        }
    };

    const handleAttachmentChange = (e, id) => {
        const file = e.target.files[0];
        setAttachments(prev => {
            const updated = prev.map(att => (att.id === id ? { ...att, file } : att));
            if (updated.length < 5 && updated.every(att => att.file !== null)) {
                updated.push({ id: updated.length + 1, file: null });
            }
            return updated;
        });
    };

    const handleSubmit = async e => {
        setLoading(true);
        e.preventDefault();

        const formData = new FormData();
        formData.append('category', inputs.category);
        formData.append('title', inputs.title);
        formData.append('description', inputs.description);
        formData.append('messages', inputs.description);
        if (category === 'order') {
            formData.append('order_id', inputs.order_id);
        }
        attachments.forEach((att, index) => {
            if (att.file) formData.append('attachments', att.file);
        });

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        };

        try {
            await axiosInstance.post(`${BACKEND_URL}/ticket/tickets/`, formData, config);
            toast.success('تیکت با موفقیت ارسال شد', {
                position: "top-left",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored"
            });
            navigate('/panel/tickets');
        } catch (error) {
            console.error('Error sending ticket:', error);
            toast.error('مشکلی در ارسال تیکت رخ داده است', {
                position: "top-left",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col md={8}>
                    <div className="shadow-sm p-4 bg-white rounded">
                        <h3 className="mb-4 text-center text-primary">ارسال تیکت</h3>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-4">
                                <Form.Label>دسته‌بندی</Form.Label>
                                <Form.Select 
                                    name="category" 
                                    value={inputs.category || ""} 
                                    onChange={handleChange} 
                                    required 
                                    className="shadow-sm p-2"
                                >
                                    <option value="">انتخاب دسته‌بندی</option>
                                    <option value="order">سفارشات تکمیل نشده</option>
                                    <option value="general">سوال عمومی</option>
                                    <option value="technical">مشکلات فنی</option>
                                </Form.Select>
                            </Form.Group>

                            {category === 'order' && (
                                <Form.Group className="mb-4">
                                    <Form.Label>سفارشات</Form.Label>
                                    <Form.Select 
                                        name="order_id" 
                                        value={inputs.order_id || ""} 
                                        onChange={handleChange} 
                                        required 
                                        className="shadow-sm p-2"
                                    >
                                        <option value="">انتخاب سفارش</option>
                                        {orders.map(order => (
                                            <option key={order.id} value={order.id}>
                                                {order.transaction_id} - {new Date(order.created_at).toLocaleDateString('fa-IR')} - {Math.round(order.total_price).toLocaleString("fa-IR")}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            )}

                            <Form.Group className="mb-4">
                                <Form.Label>عنوان</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="title"
                                    value={inputs.title || ""}
                                    onChange={handleChange}
                                    placeholder="عنوان تیکت خود را وارد کنید"
                                    className="shadow-sm p-2"
                                />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label>توضیحات</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    name="description"
                                    value={inputs.description || ""}
                                    onChange={handleChange}
                                    placeholder="توضیحات کامل در مورد مشکلی که دارید وارد کنید"
                                    className="shadow-sm p-2"
                                />
                            </Form.Group>

                            <Form.Group controlId="formFileMultiple" className="mb-4">
                                <Form.Label>افزودن ضمیمه</Form.Label>
                                {attachments.map(att => (
                                    <Form.Control
                                        key={att.id}
                                        type="file"
                                        onChange={(e) => handleAttachmentChange(e, att.id)}
                                        className="shadow-sm p-2 mb-2"
                                    />
                                ))}
                            </Form.Group>

                            <Button 
                                type="submit" 
                                variant="primary" 
                                className="w-100 shadow-sm" 
                                disabled={loading}
                            >
                                {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'ارسال تیکت'}
                            </Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default SendTicket;
