import React, { useEffect, useState } from "react";
import axiosInstance from "../../components/utils/axiosinterceptor";
import { Card, Row, Col, Button, Container, Table } from "react-bootstrap";
import { BACKEND_URL } from "../../components/utils/api";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const UserProfileDashboard = () => {
  const [orders, setOrders] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const token = sessionStorage.getItem("access_token") || localStorage.getItem("access_token");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get(`${BACKEND_URL}/cart/orders/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(response.data);
    } catch (error) {
      console.error("خطا در دریافت سفارشات:", error);
    }
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

  return (
    <Container className="my-5 font-fa">
      <h3 className="mb-4 text-primary">داشبورد کاربری</h3>
      <Row className="gy-4">
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>اطلاعات کاربر</Card.Title>
              <Card.Text>
                <strong>نام: </strong> {user?.first_name} {user?.last_name}
              </Card.Text>
              <Card.Text>
                <strong>ایمیل: </strong> {user?.email}
              </Card.Text>
              <Card.Text>
                <strong>شماره تلفن: </strong> {user?.phone_number}
              </Card.Text>
              <Button as={Link} to="/panel/profile" variant="primary">
                ویرایش پروفایل
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>آخرین سفارشات</Card.Title>
              {orders.length > 0 ? (
                <Table striped borderless hover responsive>
                  <thead>
                    <tr>
                      <th>شناسه سفارش</th>
                      <th>تاریخ</th>
                      <th>مجموع</th>
                      <th>وضعیت</th>
                      <th>عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 3).map((order) => (
                      <tr key={order.id}>
                        <td>{order.transaction_id}</td>
                        <td>{new Date(order.created_at).toLocaleDateString("fa-IR")}</td>
                        <td>{Math.round(order.total_price).toLocaleString('fa-IR')} تومان</td>
                        <td>{translateStatus(order.status)}</td>
                        <td>
                          <Button
                            as={Link}
                            to={`/panel/orderslist/${order.transaction_id}`}
                            variant="primary"
                            size="sm"
                          >
                            مشاهده جزئیات
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p>هیچ سفارشی یافت نشد.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="gy-4 mt-4">
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>مدیریت حساب</Card.Title>
              <Button as={Link} to="/panel/changepassword" variant="danger" className="d-block mb-2">
                تغییر رمز عبور
              </Button>
              <Button as={Link} to="/panel/orderslist" variant="primary" className="d-block">
                مشاهده همه سفارشات
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>تیکت‌های پشتیبانی</Card.Title>
              <Button as={Link} to="/panel/tickets" variant="primary" className="d-block mb-2">
                مشاهده تیکت‌ها
              </Button>
              <Button as={Link} to="/panel/send-ticket" variant="success" className="d-block">
                ثبت تیکت جدید
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfileDashboard;
