import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import axiosInstance from '../../components/utils/axiosinterceptor';
import { BACKEND_URL } from '../../components/utils/api';
import { toast } from 'react-toastify';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const token = sessionStorage.getItem('access_token') || localStorage.getItem('access_token');
  const dispatch = useDispatch();

  const handleSendOtp = async () => {
    try {
      await axiosInstance.post(`${BACKEND_URL}/users/pass_otp/`, { phone_number: user.phone_number });
      setOtpSent(true);
      toast.success('کد تایید برای شما ارسال شد');
    } catch (error) {
      toast.error('مشکل در ارسال کد تایید');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await axiosInstance.post(`${BACKEND_URL}/users/verify_otp/`, { phone_number: user.phone_number, otp });
      toast.success('کد تایید وارد شده صحیح است');
    } catch (error) {
      toast.error('کد تایید وارد شده صحیح نیست');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await handleVerifyOtp(); // First, verify the OTP
      await axiosInstance.put(
        `${BACKEND_URL}/users/change_password/`,
        {
          old_password: oldPassword,
          new_password: newPassword,
          confirm_password: confirmPassword,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      toast.success('رمز عبور با موفقیت تغییر کرد');
    } catch (error) {
      toast.error('تغییر رمز عبور ناموفق بود');
    }
  };

  return (
    <Container className="my-5 d-flex justify-content-center">
      <Row className="w-100">
        <Col md={8} lg={6} className="mx-auto">
          <Card className="shadow-sm">
            <Card.Body>
              <h3 className="text-center mb-4">تغییر رمز عبور</h3>
              <Form onSubmit={handleChangePassword}>
                <Form.Group controlId="oldPassword" className="mb-3">
                  <Form.Label>رمز عبور قدیمی</Form.Label>
                  <Form.Control
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                </Form.Group>
                <Form.Group controlId="newPassword" className="mb-3">
                  <Form.Label>رمز عبور جدید</Form.Label>
                  <Form.Control
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </Form.Group>
                <Form.Group controlId="confirmPassword" className="mb-3">
                  <Form.Label>تأیید رمز عبور جدید</Form.Label>
                  <Form.Control
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </Form.Group>
                {otpSent && (
                  <Form.Group controlId="otp" className="mb-3">
                    <Form.Label>کد تایید</Form.Label>
                    <Form.Control
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  </Form.Group>
                )}
                <div className="d-grid">
                  {!otpSent ? (
                    <Button variant="primary" onClick={handleSendOtp}>
                      ارسال کد تایید
                    </Button>
                  ) : (
                    <Button variant="success" type="submit">
                      تغییر رمز عبور
                    </Button>
                  )}
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ChangePassword;
