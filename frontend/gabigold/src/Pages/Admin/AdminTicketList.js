import React, { useEffect, useState } from 'react';
import axiosInstance from '../../components/utils/axiosinterceptor';
import { BACKEND_URL } from '../../components/utils/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Table, Dropdown, Form, Pagination, Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrash } from '@fortawesome/free-solid-svg-icons';

const AdminTicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [ticketsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const token = sessionStorage.getItem('access_token') || localStorage.getItem('access_token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchTickets = async () => {
      try {
        const response = await axiosInstance.get(`${BACKEND_URL}/ticket/admintickets/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        setTickets(response.data);
        setFilteredTickets(response.data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        toast.error('مشکلی در بارگزاری تیکت‌ها رخ داده است', {
          position: 'top-left',
          autoClose: 3000,
          hideProgressBar: false,
          theme: 'colored',
        });
      }
    };

    fetchTickets();
  }, [token, navigate]);

  useEffect(() => {
    const filtered = tickets.filter(
      (ticket) =>
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.user.phone_number.includes(searchTerm)
    );
    setFilteredTickets(filtered);
  }, [searchTerm, tickets]);

  const sortTickets = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedTickets = [...filteredTickets].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

 const statusTranslation = {
    open: 'باز',
    pending: 'در انتظار',
    closed: 'بسته',
 };

 const categoryTranslation = {
    order: 'سفارش',
    general: 'عمومی',
    technical: 'فنی',
 };

  // Pagination logic
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = sortedTickets.slice(indexOfFirstTicket, indexOfLastTicket);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDeleteTicket = async (ticketId) => {
    try {
      await axiosInstance.delete(`${BACKEND_URL}/ticket/tickets/${ticketId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('تیکت با موفقیت حذف شد');
      setTickets((prevTickets) => prevTickets.filter(ticket => ticket.id !== ticketId));
    } catch (error) {
      toast.error('خطا در حذف تیکت');
    }
  };

  return (
    <Container className="my-5 font-fa">
      <Row className="mb-4 justify-content-between align-items-center">
        <Col>
          <h3 className="text-primary">مدیریت تیکت‌ها</h3>
        </Col>
        <Col className="text-end">
          <Form.Group controlId="searchTerm" className="d-inline-block w-50">
            <Form.Control
              type="text"
              placeholder="جستجو تیکت‌ها..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>
      {tickets.length > 0 ? (
        <>
          <Table striped borderless hover responsive className="shadow-sm">
            <thead className="table-light">
              <tr>
                <th onClick={() => sortTickets('id')}>شماره تیکت</th>
                <th onClick={() => sortTickets('user.phone_number')}>شماره کاربر</th>
                <th onClick={() => sortTickets('title')}>عنوان</th>
                <th onClick={() => sortTickets('category')}>دسته‌بندی</th>
                <th onClick={() => sortTickets('status')}>وضعیت</th>
                <th onClick={() => sortTickets('created_at')}>تاریخ ایجاد</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {currentTickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.id}</td>
                  <td>{ticket.user.phone_number}</td>
                  <td>{ticket.title}</td>
                  <td>{categoryTranslation[ticket.category]}</td>
                  <td>{statusTranslation[ticket.status]}</td>
                  <td>{new Date(ticket.created_at).toLocaleDateString('fa-IR')}</td>
                  <td>
                    <Dropdown align="end">
                      <Dropdown.Toggle variant="primary" id="dropdown-basic" size="sm">
                        عملیات
                      </Dropdown.Toggle>

                      <Dropdown.Menu className="user-dropdown dropdown-menu-right mt-0" style={{ minWidth: "15vh", zIndex: "10000" }}>
                        <Dropdown.Item
                          onClick={() => navigate(`/panel/tickets/${ticket.id}`)}
                          className="fw-bold text-right dropdown-item-custom w-75"
                        >
                          <FontAwesomeIcon icon={faEye} className="ms-2" /> جزئیات
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => handleDeleteTicket(ticket.id)}
                          className="fw-bold text-right dropdown-item-custom w-75"
                        >
                          <FontAwesomeIcon icon={faTrash} className="ms-2 text-danger" /> حذف
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination className="justify-content-center mt-4">
            {[...Array(Math.ceil(filteredTickets.length / ticketsPerPage)).keys()].map((number) => (
              <Pagination.Item key={number + 1} onClick={() => paginate(number + 1)} active={currentPage === number + 1}>
                {number + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </>
      ) : (
        <p className="text-center">هیچ تیکتی یافت نشد</p>
      )}
    </Container>
  );
};

export default AdminTicketList;
