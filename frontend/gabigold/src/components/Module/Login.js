import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../store/actions/authActions';
import { Form, Button, Container, Row, Col, InputGroup, Card, FormCheck } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMobilePhone, faUnlockAlt, faX } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import Frame from './Frame';
import Logo from "../../assets/images/blogo2.png"

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const accessToken = sessionStorage.getItem('access_token') || localStorage.getItem('access_token');

    useEffect(() => {
        if (accessToken) {
            const nextUrl = localStorage.getItem('next');
            if (!nextUrl) {
                navigate('/');
            } else {
                navigate(nextUrl);
                localStorage.removeItem('next');
            }
        }
    }, [accessToken, navigate]);

    const resetForm = () => {
        setUsername('');
        setPassword('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const response = await dispatch(login({ phone_number: username, password, rememberMe}));
        if (response && response.error) {
            resetForm();
        } else {
            const nextUrl = localStorage.getItem('next') || '/';
            navigate(nextUrl);
            localStorage.removeItem('next');
            resetForm();
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
                <img src={Logo} className='img-flui' style={{height:"70%"}}/>
                </div>
                <Col className="d-flex align-items-center justify-content-center">
                    <div className="shadow-soft border rounded border-light p-3 p-lg-4 w-100">
                        <Form className="mt-4" onSubmit={handleLogin}>
                            <Form.Group id="phone_number" className="mb-4">
                                <Form.Label>شماره همراه</Form.Label>
                                <InputGroup className='border-bottom border-primary'>
                                    <InputGroup.Text className='border border-none bg-white input-group-text'>
                                        <FontAwesomeIcon icon={faMobilePhone} />
                                    </InputGroup.Text>
                                    <Form.Control
                                        autoFocus
                                        required
                                        name="phone_number"
                                        type="tel"
                                        value={username}
                                        placeholder="09123456789"
                                        minLength={11}
                                        maxLength={11}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className='input-group-text'
                                        autoComplete='username'
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group id="password" className="mb-4">
                                <Form.Label>رمز عبور</Form.Label>
                                <InputGroup className='border-bottom border-primary'>
                                    <InputGroup.Text  className='border border-none bg-white input-group-text'>
                                        <FontAwesomeIcon icon={faUnlockAlt} />
                                    </InputGroup.Text>
                                    <Form.Control
                                        required
                                        type="password"
                                        value={password}
                                        placeholder="Password"
                                        id="password"
                                        onChange={(e) => setPassword(e.target.value)}
                                        className='input-group-text'
                                        autoComplete='current-password'
                                    />
                                </InputGroup>
                            </Form.Group>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <Form.Check type="checkbox">
                                <FormCheck.Input id="defaultCheck5" className="me-2" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                                    <FormCheck.Label htmlFor="defaultCheck5" className="mb-0 me-2">
                                        من را به خاطر بسپار
                                    </FormCheck.Label>
                                </Form.Check>
                                <Card.Link as={Link} to="/forget" className="small text-end">
                                    بازیابی رمزعبور
                                </Card.Link>
                            </div>
                            <Button variant="primary rounded" type="submit" className="w-100">
                                ورود
                            </Button>
                        </Form>
                        <div className="d-flex justify-content-center align-items-center mt-4">
                            <span className="fw-normal">
                                عضو نیستید؟
                                <Card.Link as={Link} to="/signup" className="fw-bold">
                                    {` ساخت حساب `}
                                </Card.Link>
                            </span>
                        </div>
                    </div>
                </Col>
            </Row>
        </Frame>
    );
};

export default Login;
