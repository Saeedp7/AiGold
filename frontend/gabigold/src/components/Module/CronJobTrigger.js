// src/components/CronJobTrigger.js
import React, { useState } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import axiosInstance from '../utils/axiosinterceptor';
import { BACKEND_URL } from '../utils/api';
import { toast } from 'react-toastify';

const CronJobTrigger = () => {
    const [loading, setLoading] = useState(false);
    const [selectedJob, setSelectedJob] = useState('');
    const token = sessionStorage.getItem('access_token') || localStorage.getItem('access_token');

    const handleTriggerJob = async () => {
        if (!selectedJob) {
            toast.error('لطفاً یک کار را انتخاب کنید');
            return;
        }

        setLoading(true);

        try {
            const response = await axiosInstance.post(
                `${BACKEND_URL}/analytics/trigger-cron-jobs/`,
                { job_type: selectedJob },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Send the token in the Authorization header
                    },
                }
            );

            toast.success(response.data.message);
        } catch (error) {
            console.error('Error triggering cron job:', error);
            toast.error('مشکلی در اجرای کار رخ داده است.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="cron-job-trigger-container mt-5">
            <h3 className="text-center mb-4">اجرای کارهای دوره‌ای</h3>
            <Form.Group controlId="cronJobSelect" className="mb-3">
                <Form.Label>انتخاب کار دوره‌ای</Form.Label>
                <Form.Control 
                    as="select" 
                    value={selectedJob} 
                    onChange={(e) => setSelectedJob(e.target.value)}
                >
                    <option value="">انتخاب کنید</option>
                    <option value="update_prices">به‌روزرسانی قیمت‌ها</option>
                    <option value="fetch_gold_price">دریافت قیمت طلا</option>
                    <option value="fetch_products_price">دریافت قیمت محصولات</option>
                    <option value="check_expired_otps">بررسی انقضای OTP</option>
                </Form.Control>
            </Form.Group>
            <div className="text-center">
                <Button variant="primary" onClick={handleTriggerJob} disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : 'اجرای کار'}
                </Button>
            </div>
        </div>
    );
};

export default CronJobTrigger;
