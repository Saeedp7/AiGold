import React, { useEffect, useState } from 'react';
import { Table, Button, Collapse, Spinner, Tabs, Tab } from 'react-bootstrap';
import axiosInstance from '../../components/utils/axiosinterceptor';
import { BACKEND_URL } from '../../components/utils/api';
import { toast } from 'react-toastify';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [activeTab, setActiveTab] = useState('all');
    const token = sessionStorage.getItem('access_token') || localStorage.getItem('access_token');

    // States to store the counts of orders by status
    const [orderCounts, setOrderCounts] = useState({
        all: 0,
        PENDING: 0,
        PROCESSING: 0,
        SHIPPED: 0,
        DELIVERED: 0,
        CANCELLED: 0
    });

    useEffect(() => {
        async function fetchOrders() {
            try {
                const response = await axiosInstance.get(`${BACKEND_URL}/cart/orders/`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                const fetchedOrders = response.data;
                setOrders(fetchedOrders);
                setFilteredOrders(fetchedOrders);
                updateOrderCounts(fetchedOrders);
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
            } finally {
                setLoading(false);
            }
        }
        fetchOrders();
    }, [token]);

    const updateOrderCounts = (orders) => {
        const counts = {
            all: orders.length,
            PENDING: orders.filter(order => order.status === 'PENDING').length,
            PROCESSING: orders.filter(order => order.status === 'PROCESSING').length,
            SHIPPED: orders.filter(order => order.status === 'SHIPPED').length,
            DELIVERED: orders.filter(order => order.status === 'DELIVERED').length,
            CANCELLED: orders.filter(order => order.status === 'CANCELLED').length,
        };
        setOrderCounts(counts);
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

    const toggleOrderDetails = (orderId) => {
        setSelectedOrderId(selectedOrderId === orderId ? null : orderId);
    };

    const handleTabSelect = (status) => {
        setActiveTab(status);
        if (status === 'all') {
            setFilteredOrders(orders);
        } else {
            setFilteredOrders(orders.filter(order => order.status === status));
        }
    };

    return (
        <div className="padding-general navDistance font-fa">
            <h3 className='mb-3'>سفارش‌های شما</h3>
            {loading ? (
                <div className="d-flex justify-content-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <>
                    {orders.length === 0 ? (
                        <p>شما هیچ سفارشی ندارید.</p>
                    ) : (
                        <>
                            <Tabs
                                id="order-status-tabs"
                                activeKey={activeTab}
                                onSelect={handleTabSelect}
                                className="mb-3"
                                fill
                            >
                                <Tab eventKey="all" title={`همه سفارش‌ها (${(orderCounts.all).toLocaleString('fa-IR')})`} />
                                <Tab eventKey="PENDING" title={`در انتظار (${(orderCounts.PENDING).toLocaleString('fa-IR')})`} />
                                <Tab eventKey="PROCESSING" title={`در حال پردازش (${(orderCounts.PROCESSING).toLocaleString('fa-IR')})`} />
                                <Tab eventKey="SHIPPED" title={`ارسال شده (${(orderCounts.SHIPPED).toLocaleString('fa-IR')})`} />
                                <Tab eventKey="DELIVERED" title={`تحویل داده شده (${(orderCounts.DELIVERED).toLocaleString('fa-IR')})`} />
                                <Tab eventKey="CANCELLED" title={`لغو شده (${(orderCounts.CANCELLED).toLocaleString('fa-IR')})`} />
                            </Tabs>

                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>شماره تراکنش</th>
                                        <th>مبلغ کل</th>
                                        <th>وضعیت</th>
                                        <th>عملیات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map((order, index) => (
                                        <React.Fragment key={order.id}>
                                            <tr onClick={() => toggleOrderDetails(order.transaction_id)} style={{ cursor: 'pointer' }}>
                                                <td>{index + 1}</td>
                                                <td>{order.transaction_id}</td>
                                                <td>{order.total_price.toLocaleString('fa-IR')} تومان</td>
                                                <td>{translateStatus(order.status)}</td>
                                                <td>
                                                    <Button variant="link" onClick={(e) => { e.stopPropagation(); toggleOrderDetails(order.transaction_id); }} className='p-0'>
                                                        {selectedOrderId === order.transaction_id ? 'بستن' : 'جزئیات'}
                                                    </Button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan="5">
                                                    <Collapse in={selectedOrderId === order.transaction_id}>
                                                        <div className="p-3">
                                                            <strong>جزئیات سفارش:</strong>
                                                            <p>آدرس: {order.address}</p>
                                                            <p>شماره تماس: {order.contact_info}</p>
                                                            <p>تاریخ ایجاد: {new Date(order.created_at).toLocaleString('fa-IR')}</p>
                                                            <strong>آیتم‌ها:</strong>
                                                            <ul>
                                                                {order.items.map(item => (
                                                                    <li key={item.id}>
                                                                        <span>{item.product.name} - </span>
                                                                        <span>{item.price.toLocaleString('fa-IR')} تومان</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </Collapse>
                                                </td>
                                            </tr>
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </Table>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default Orders;
