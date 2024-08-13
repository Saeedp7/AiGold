import React, { useState, useEffect } from "react";
import axiosInstance from "../../components/utils/axiosinterceptor";
import { useParams } from "react-router-dom";
import { ListGroup, Form, Button } from "react-bootstrap";
import { BACKEND_URL } from "../../components/utils/api";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const TicketDetails = () => {
    const { ticketid } = useParams(); // Ticket ID from URL
    const [ticket, setTicket] = useState(null);
    const [message, setMessage] = useState("");
    const [attachments, setAttachments] = useState([{ id: 1, file: null }]);
    const [status, setStatus] = useState("");
    const token = sessionStorage.getItem('access_token') || localStorage.getItem('access_token');
    const user = useSelector((state) => state.auth.user);

    const categoryTranslations = {
        order: 'سفارش',
        general: 'عمومی',
        technical: 'فنی',
    };

    useEffect(() => {
        const fetchTicketDetails = async () => {
            try {
                const response = await axiosInstance.get(`${BACKEND_URL}/ticket/tickets/${ticketid}/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setTicket(response.data);
                setStatus(response.data.status);
            } catch (error) {
                console.error("Error fetching ticket details:", error);
                toast.error('مشکلی در بارگزاری تیکت رخ داده است', {
                    position: "top-left",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "colored"
                });
            }
        };

        fetchTicketDetails();
    }, [ticketid, token]);

    const handleSendMessage = async () => {
        if (!message.trim()) {
            toast.error('پیام نمی‌تواند خالی باشد', {
                position: "top-left",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored"
            });
            return;
        }

        const formData = new FormData();
        formData.append('message', message);
        attachments.forEach(att => {
            if (att.file) {
                formData.append('attachments', att.file);
            }
        });

        try {
            const response = await axiosInstance.post(`${BACKEND_URL}/ticket/tickets/${ticketid}/messages/`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    }
                });

            setTicket(prevTicket => ({
                ...prevTicket,
                messages: [...prevTicket.messages, response.data]
            }));
            setMessage("");
            setAttachments([{ id: 1, file: null }]);
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error('مشکلی در ارسال پیام رخ داده است', {
                position: "top-left",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored"
            });
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            await axiosInstance.patch(`${BACKEND_URL}/ticket/tickets/${ticketid}/status/`,
                { status: newStatus },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });

            setStatus(newStatus);
            toast.success('وضعیت تیکت با موفقیت بروزرسانی شد', {
                position: "top-left",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored"
            });
        } catch (error) {
            console.error("Error updating ticket status:", error);
            toast.error('مشکلی در بروزرسانی وضعیت تیکت رخ داده است', {
                position: "top-left",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored"
            });
        }
    };

    if (!ticket) {
        return <p>در حال بارگزاری...</p>;
    }

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

    return (
        <div className="padding-general navDistance">
            <h3 className="mb-4 text-primary">جزئیات تیکت</h3>
            <div className="shadow-sm p-4 bg-white rounded">
                <div className="bg-primary text-white p-3 rounded mb-4">
                    <h5>{ticket.title}</h5>
                    {ticket.order && ticket.order.transaction_id && (
                        <p className="mb-0">
                            <strong>شماره سفارش:</strong> {ticket.order.transaction_id}<br />
                        </p>
                    )}
                    <p className="mb-0">
                        <strong>دسته‌بندی:</strong> {categoryTranslations[ticket.category] || "نامشخص"}<br />
                        <strong>وضعیت:</strong> {status === 'open' ? 'باز' : status === 'pending' ? 'در انتظار' : 'بسته'}<br />
                        <strong>توضیحات:</strong> {ticket.description}
                    </p>
                    {user.is_staff && (
                        <Form.Group controlId="statusSelect" className="mt-3">
                            <Form.Label className="text-white">تغییر وضعیت تیکت:</Form.Label>
                            <Form.Control
                                as="select"
                                value={status}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                className="shadow-sm"
                            >
                                <option value="open">باز</option>
                                <option value="pending">در انتظار</option>
                                <option value="closed">بسته</option>
                            </Form.Control>
                        </Form.Group>
                    )}
                </div>
                <ListGroup variant="flush">
                    {ticket.messages.map(message => (
                        <ListGroup.Item 
                            key={message.id} 
                            className={`border-bottom d-flex ${message.user ? 'justify-content-start' : 'justify-content-end'}`}
                        >
                            <div className={`p-3 rounded ${message.user ? 'bg-light text-dark' : 'bg-primary text-white'}`}>
                                <div><span>{message.user ? "گابی" : "کاربر"}: </span>
                                <span>{message.message}</span></div>
                                {message.attachments && message.attachments.length > 0 && (
                                    <div className="mt-2">
                                        <strong>پیوست‌ها:</strong>
                                        <ul className="list-unstyled">
                                            {message.attachments.map(att => (
                                                <li key={att.id}>
                                                    <a href={att.file} target="_blank" rel="noopener noreferrer" className={`${message.user ? 'text-black' : 'text-white'} text-decoration-none`}>دانلود فایل</a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                <div className={`bg-white text-muted small mt-2 rounded px-2 py-1`}>
                                    {new Date(message.created_at).toLocaleString("fa-IR")}
                                </div>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
                <Form className="mt-3">
                    <Form.Group>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="پیام خود را بنویسید..."
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            className="rounded-2 w-100 shadow-sm"
                        />
                    </Form.Group>
                    <Form.Group className="mt-3">
                        <Form.Label>افزودن ضمیمه‌ها</Form.Label>
                        {attachments.map(att => (
                            <Form.Control
                                key={att.id}
                                type="file"
                                onChange={(e) => handleAttachmentChange(e, att.id)}
                                className="mb-2 shadow-sm"
                            />
                        ))}
                    </Form.Group>
                    <Button variant="primary" className="mt-2 shadow-sm" onClick={handleSendMessage}>
                        ارسال پیام
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default TicketDetails;
