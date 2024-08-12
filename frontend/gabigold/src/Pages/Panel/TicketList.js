import React, { useEffect, useState } from 'react';
import axiosInstance from '../../components/utils/axiosinterceptor';
import { BACKEND_URL } from '../../components/utils/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Tabs, Tab, Table, Spinner } from 'react-bootstrap';

const TicketList = () => {
    const [tickets, setTickets] = useState([]);
    const [filteredTickets, setFilteredTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const navigate = useNavigate();
    const token = sessionStorage.getItem('access_token') || localStorage.getItem('access_token');

    // States to store the counts of tickets by status
    const [ticketCounts, setTicketCounts] = useState({
        all: 0,
        open: 0,
        pending: 0,
        closed: 0,
    });

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchTickets = async () => {
            try {
                const response = await axiosInstance.get(`${BACKEND_URL}/ticket/tickets/`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const fetchedTickets = response.data;
                setTickets(fetchedTickets);
                setFilteredTickets(fetchedTickets);
                updateTicketCounts(fetchedTickets);
            } catch (error) {
                console.error('Error fetching tickets:', error);
                toast.error('مشکلی در بارگزاری تیکت‌ها رخ داده است', {
                    position: "top-left",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "colored",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, [token, navigate]);

    const updateTicketCounts = (tickets) => {
        const counts = {
            all: tickets.length,
            open: tickets.filter(ticket => ticket.status === 'open').length,
            pending: tickets.filter(ticket => ticket.status === 'pending').length,
            closed: tickets.filter(ticket => ticket.status === 'closed').length,
        };
        setTicketCounts(counts);
    };

    const handleTabSelect = (status) => {
        setActiveTab(status);
        if (status === 'all') {
            setFilteredTickets(tickets);
        } else {
            setFilteredTickets(tickets.filter(ticket => ticket.status === status));
        }
    };

    // Translation maps for status and category
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

    return (
        <div className="padding-general navDistance font-fa">
            <h3 className="mb-4">تیکت‌ها</h3>
            {loading ? (
                <div className="d-flex justify-content-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <>
                    <Tabs
                        id="ticket-status-tabs"
                        activeKey={activeTab}
                        onSelect={handleTabSelect}
                        className="mb-3"
                        fill
                    >
                        <Tab eventKey="all" title={`همه (${ticketCounts.all})`} />
                        <Tab eventKey="open" title={`باز (${ticketCounts.open})`} />
                        <Tab eventKey="pending" title={`در انتظار (${ticketCounts.pending})`} />
                        <Tab eventKey="closed" title={`بسته (${ticketCounts.closed})`} />
                    </Tabs>

                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>عنوان</th>
                                <th>دسته‌بندی</th>
                                <th>وضعیت</th>
                                <th>تاریخ ایجاد</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTickets.length > 0 ? (
                                filteredTickets.map((ticket, index) => (
                                    <tr key={ticket.id} onClick={() => navigate(`/panel/tickets/${ticket.id}`)} style={{ cursor: 'pointer' }}>
                                        <td>{index + 1}</td>
                                        <td>{ticket.title}</td>
                                        <td>{categoryTranslation[ticket.category] || ticket.category}</td>
                                        <td>{statusTranslation[ticket.status] || ticket.status}</td>
                                        <td>{new Date(ticket.created_at).toLocaleDateString("fa-IR")}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center">هیچ تیکتی یافت نشد</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </>
            )}
        </div>
    );
};

export default TicketList;
