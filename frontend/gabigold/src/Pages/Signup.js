import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Form, Button, Row, Col, InputGroup } from 'react-bootstrap';
import { sendOTP, verifyOTP, register } from '../store/actions/authActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import Frame from '../components/Module/Frame';
import Logo from "../assets/images/blogo2.png"
import { toast } from 'react-toastify';

const SignupForm = () => {
    const [step, setStep] = useState(1);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [codeMelli, setCodeMelli] = useState('');
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handlePhoneNumberSubmit = async (e) => {
        e.preventDefault();
        const response = await dispatch(sendOTP({ phone_number: phoneNumber }));
        if (response.success) {
            toast.success("کد اعتبارسنجی برای شما ارسال شد");
            setStep(2);
        } else {
            toast.error(response.error.detail);
        }
    };

    
    const isValidIranianNationalCode = input => {
        if (!/^\d{10}$/.test(input)) return false;
        const check = +input[9];
        const sum = input.split('').slice(0, 9).reduce((acc, x, i) => acc + +x * (10 - i), 0) % 11;
        return sum < 2 ? check === sum : check + sum === 11;
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        const response = await dispatch(verifyOTP({ phone_number: phoneNumber, otp }));
        if (response.success) {
            toast.success("اعتبارسنجی موفقیت امیز بود");
            setStep(3);
        } else {
            toast.error("کد وارد شده صحیح نمی باشد");
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.success("پسوردها همخوانی ندارند");
            return;
        }
        if (isValidIranianNationalCode(codeMelli)) {
            const response = await dispatch(register({ phone_number: phoneNumber, otp, password, confirm_password: confirmPassword, code_melli: codeMelli }));
            if (!response.error) {
                toast.success('ثبت نام موفقیت آمیز بود');
                navigate('/login');
            } else {
                toast.error(response.error.code_melli ? 'کد ملی قبلا ثبت شده است' : response.error || 'خطا در ثبت نام');
            }
        } else {
            toast.error('کد ملی وارد شده صحیح نمی باشد', {
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

    return (
        <Frame isVisible={true}>
            <div className="d-block">
            <button className="btn btn-link" onClick={() => navigate("..")}>
              <FontAwesomeIcon icon={faX} />
            </button>
            </div>
            <Row className="justify-content-center form-bg-image">
                <div className='d-flex align-items-center justify-content-center'>
                <img src={Logo} className='img-flui' style={{height:"70%"}} alt='Gabi Gold Gallery'/>
                </div>
                <Col xs={12} className="d-flex align-items-center justify-content-center">
                    <div className="shadow-soft border rounded border-light p-3 p-lg-4 w-100">
            {step === 1 && (
                <Form onSubmit={handlePhoneNumberSubmit}>
                    <Form.Group id="phone_number" className="mb-4">
                                <Form.Label>شماره همراه</Form.Label>
                                <InputGroup className='border-bottom border-primary'>
                        <Form.Control
                            type="text"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                        />
                    </InputGroup>
                    </Form.Group>
                    <Button type="submit">مرحله بعد</Button>
                    {error && <p>{error}</p>}
                </Form>
            )}
            {step === 2 && (
                <Form onSubmit={handleOtpSubmit}>
                    <Form.Group id="phone_number" className="mb-4">
                    <Form.Label>شماره همراه</Form.Label>
                        <Form.Control type="text" value={phoneNumber} readOnly />
                    </Form.Group>
                    <Form.Group id="OTP" className="mb-4">
                        <Form.Label>کد تایید</Form.Label>
                        <Form.Control
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button type="submit">بررسی کد</Button>
                    {error && <p>{error}</p>}
                </Form>
            )}
            {step === 3 && (
                <Form onSubmit={handleRegisterSubmit}>
                    <Form.Group id="password" className="mb-4">
                        <Form.Label>رمز عبور</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete='new-password'
                            required
                        />
                    </Form.Group>
                    <Form.Group id="confirmpassword" className="mb-4">
                        <Form.Label>تایید رمزعبور</Form.Label>
                        <Form.Control
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            autoComplete='new-password'
                            required
                        />
                    </Form.Group>
                    <Form.Group id="codemelli" className="mb-4">
                        <Form.Label>کد ملی</Form.Label>
                        <Form.Control
                            type="text"
                            value={codeMelli}
                            onChange={(e) => setCodeMelli(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button type="submit">ثبت نام</Button>
                    {error && <p>{error}</p>}
                </Form>
            )}
            <div className="d-flex justify-content-center align-items-center mt-4">
                            <span className="fw-normal">
                                عضو هستید؟
                                <Link to="/login" className="fw-bold"> {` ورود `} </Link>
                            </span>
                        </div>
            </div>
                            </Col>
                            </Row>
        </Frame>
    );
};

export default SignupForm;
