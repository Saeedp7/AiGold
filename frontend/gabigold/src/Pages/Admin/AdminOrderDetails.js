import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../../components/utils/axiosinterceptor';
import { BACKEND_URL } from '../../components/utils/api';
import { toast } from 'react-toastify';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';

const AdminOrderDetails = () => {
  const { transaction_id } = useParams();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const fetchOrderDetails = async () => {
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    try {
      const response = await axiosInstance.get(`${BACKEND_URL}/cart/orders/${transaction_id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrder(response.data);
      setStatus(response.data.status);
      setTrackingNumber(response.data.tracking_number || '');
    } catch (error) {
      console.error('خطا در دریافت جزئیات سفارش:', error);
      toast.error('خطا در دریافت جزئیات سفارش');
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);

    if (newStatus !== 'SHIPPED') {
      await updateOrderStatus(newStatus);
    }
  };

  const updateOrderStatus = async (newStatus, trackingNumber = '') => {
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    const data = { status: newStatus };
    if (newStatus === 'SHIPPED') {
      data.tracking_number = trackingNumber;
    }

    try {
      const response = await axiosInstance.patch(`${BACKEND_URL}/cart/orders/${order.id}/status/`, 
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('پاسخ به‌روزرسانی وضعیت:', response.data);
      toast.success('وضعیت سفارش با موفقیت به‌روزرسانی شد');
    } catch (error) {
      console.error('خطا در به‌روزرسانی وضعیت سفارش:', error);
      toast.error('خطا در به‌روزرسانی وضعیت سفارش');
    }
  };

  const handleTrackingNumberSubmit = async () => {
    await updateOrderStatus('SHIPPED', trackingNumber);
  };

  const handleTrackingNumberChange = (e) => {
    setTrackingNumber(e.target.value);
  };

  const translateStatus = (status) => {
    const statusTranslations = {
      PENDING: 'در انتظار',
      DELIVERED: 'تحویل داده شده',
      CANCELLED: 'لغو شده',
      PROCESSING: 'در حال پردازش',
      SHIPPED: 'ارسال شده',
      COMPLETED: 'پرداخت شده'
      // Add more status translations as needed
    };
    return statusTranslations[status] || status;
  };

  if (!order) {
    return <div>در حال بارگذاری...</div>;
  }

  return (
    <Container className="my-5 font-fa">
      <h3 className="mb-4">جزئیات سفارش</h3>
      <Card className="shadow-sm p-4 mb-4 w-100">
        <Row>
          <Col md={6}>
            <p><strong>شناسه تراکنش:</strong> {order.transaction_id}</p>
            <p><strong>مشتری:</strong> {order.user ? `${order.user.first_name} ${order.user.last_name}` : 'N/A'}</p>
            <p><strong>آدرس:</strong> {order.address}</p>
            <p><strong>اطلاعات تماس:</strong> {order.contact_info}</p>
          </Col>
          <Col md={6}>
            <p><strong>میزان تخفیف : </strong> {Math.round(order.discount_amount).toLocaleString('fa-IR')} تومان</p>
            <p><strong>قیمت کل:</strong> {Math.round(order.total_price).toLocaleString('fa-IR')} تومان</p>
            <p><strong>وضعیت:</strong> {translateStatus(order.status)}</p>
            <p><strong>تاریخ ایجاد:</strong> {new Date(order.created_at).toLocaleString('fa-IR')}</p>
          </Col>
        </Row>
      </Card>
      <h4 className="mt-4">آیتم‌ها</h4>
      {order.items && order.items.length > 0 ? (
        <Row>
          {order.items.map((item, index) => (
            <Col md={4} className="mb-4" key={index}>
              <Card className="shadow-sm">
                <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                  <Card.Img variant="top" src={BACKEND_URL + item.product.thumbnail} alt={item.product.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                </div>
                <Card.Body>
                  <Card.Title>{item.product.name}</Card.Title>
                  <Card.Text><strong>کد محصول:</strong> {item.product.product_code}</Card.Text>
                  <Card.Text><strong>وزن:</strong> {item.product.weight} گرم</Card.Text>
                  <Card.Text><strong>اجرت:</strong> {Math.round(item.product.wage).toLocaleString('fa-IR')} %</Card.Text>
                  <Card.Text><strong>قیمت:</strong> {Math.round(item.price).toLocaleString('fa-IR')} تومان</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p>هیچ آیتمی برای این سفارش یافت نشد.</p>
      )}
      <Form.Group className="mt-4">
        <Form.Label><strong>به‌روزرسانی وضعیت:</strong></Form.Label>
        <Form.Control as="select" value={status} onChange={handleStatusChange} className="w-50">
          <option value="PENDING">در انتظار</option>
          <option value="PROCESSING">در حال پردازش</option>
          <option value="SHIPPED">ارسال شده</option>
          <option value="DELIVERED">تحویل شده</option>
          <option value="CANCELLED">لغو شده</option>
        </Form.Control>
      </Form.Group>
      {status === 'SHIPPED' && (
        <Form.Group className="mt-4">
          <Form.Label><strong>شماره پیگیری:</strong></Form.Label>
          <Row>
            <Col md={8}>
              <Form.Control
                type="text"
                value={trackingNumber}
                onChange={handleTrackingNumberChange}
                className="w-100"
              />
            </Col>
            <Col md={4}>
              <Button onClick={handleTrackingNumberSubmit} className="w-100">ثبت شماره پیگیری</Button>
            </Col>
          </Row>
        </Form.Group>
      )}
      <Link to="/panel/orderslist" className="btn btn-secondary mt-3">بازگشت به لیست سفارش‌ها</Link>
    </Container>
  );
};

export default AdminOrderDetails;
