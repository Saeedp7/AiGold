import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Pagination, Container, Row, Col } from 'react-bootstrap';
import axiosInstance from '../../components/utils/axiosinterceptor';
import { BACKEND_URL } from '../../components/utils/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [filter, setFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    try {
      const response = await axiosInstance.get(`${BACKEND_URL}/cart/adminorders/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(response.data);
      setFilteredOrders(response.data);
    } catch (error) {
      console.error('خطا در دریافت سفارشات:', error);
      toast.error('خطا در دریافت سفارشات');
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

  // Get current orders
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle filter
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    const filtered = orders.filter(order =>
      order.contact_info.toLowerCase().includes(e.target.value.toLowerCase()) ||
      order.status.toLowerCase().includes(e.target.value.toLowerCase()) ||
      order.transaction_id.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

  return (
    <Container className="my-5 font-fa">
      <Row className="mb-4 justify-content-between align-items-center">
        <Col>
          <h3 className="text-primary">مدیریت سفارشات</h3>
        </Col>
        <Col className="text-end">
          <Form.Group controlId="filter">
            <Form.Control
              type="text"
              placeholder="فیلتر بر اساس مشتری، وضعیت، یا شناسه سفارش"
              value={filter}
              onChange={handleFilterChange}
              className="w-50 d-inline-block"
            />
          </Form.Group>
        </Col>
      </Row>
      <Table striped borderless hover responsive className="shadow-sm">
        <thead className="table-white">
          <tr>
            <th>شناسه</th>
            <th>مشتری</th>
            <th>تاریخ</th>
            <th>وضعیت</th>
            <th>مجموع</th>
            <th>شناسه سفارش</th>
            <th>عملیات</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.map((order) => (
            <tr key={order.id} onClick={() => navigate(`/panel/orderslist/${order.transaction_id}`)} style={{ cursor: 'pointer' }}>
              <td>{order.id}</td>
              <td>{order.contact_info}</td>
              <td>{new Date(order.created_at).toLocaleDateString('fa-IR')}</td>
              <td>{translateStatus(order.status)}</td>
              <td>{Math.round(order.total_price).toLocaleString('fa-IR')}</td>
              <td>{order.transaction_id}</td>
              <td>
                <Button variant="primary" size="sm">
                  مشاهده جزئیات
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination className="justify-content-center mt-4">
        {Array.from({ length: Math.ceil(filteredOrders.length / ordersPerPage) }, (_, index) => (
          <Pagination.Item key={index + 1} onClick={() => paginate(index + 1)} active={currentPage === index + 1}>
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </Container>
  );
};

export default OrdersList;
