import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Row, Col, Card, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp, faX, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import Frame from "../components/Module/Frame";
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { requestPasswordReset } from '../store/actions/authActions';

const RecoverPassword = () => {
  const navigate = useNavigate();
  const ref = useRef(null);
  const ref2 = useRef(null);
  const [slide, setSlide] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  const resetForm = () => {
    setPhoneNumber('');
  };

  const handleRecoverPassword = async (e) => {
    e.preventDefault();
    const { success, error } = await dispatch(requestPasswordReset(phoneNumber));
  };

  const handleClick = () => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
    setSlide(false);
  };

  const handleClick2 = () => {
    ref2.current?.scrollIntoView({ behavior: 'smooth' });
    setSlide(true);
  };

  return (
    <Frame isVisible={true}>
          <button className="btn btn-link" style={{ float: "right" }} onClick={() => navigate("..")}>
            <FontAwesomeIcon icon={faX} />
          </button>
          <div>
            <div className="text-center text-md-center mt-4 mt-md-5">
              <span className="h3 mb-0 shadow-4-strong" style={{ textShadow: "-5px 5px 4px rgba(0, 0, 0, 0.25)" }}>
                بازیابی رمزعبور
              </span>
              <br />
              <br />
            </div>
            <div className="d-md-none mt-4 mt-lg-0" onClick={handleClick} style={slide ? { display: 'block' } : { display: 'none' }}>
              <center>
                <FontAwesomeIcon icon={faAngleDown} />
              </center>
            </div>
            <div ref={ref} className="d-block mt-5 mt-lg-0">
              <Row className="justify-content-center">
                <p className="text-center">
                  <Card.Link as={Link} to={"/login"} className="text-gray-700">
                    <FontAwesomeIcon icon={faAngleRight} className="me-2" /> بازگشت به صفحه ورود
                  </Card.Link>
                </p>
                <Col xs={12} className="d-flex align-items-center justify-content-center">
                  <div className="signin-inner my-3 my-lg-0 bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                    <h3>رمزعبور خود را فراموش کرده‌اید؟</h3>
                    <p className="mb-4">جای نگرانی نیست,کافیست شماره همراه خود را وارد کنید تا رمزعبور برای شما ارسال شود</p>
                    <Form onSubmit={handleRecoverPassword}>
                      <div className="mb-4">
                        <Form.Label htmlFor="phone_number">شماره همراه</Form.Label>
                        <InputGroup id="phone_number">
                          <Form.Control autoFocus required name="phone_number" type="tel" placeholder="09123456789" minLength={11} maxLength={11} value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                        </InputGroup>
                      </div>
                      <Button variant="primary" type="submit" className="w-100">
                        بازیابی رمزعبور
                      </Button>
                    </Form>
                  </div>
                </Col>
              </Row>
            </div>
            <div className="d-block d-md-none mh-2" onClick={handleClick2} style={{ textAlign: "center" }}>
              <FontAwesomeIcon icon={faAngleUp} />
            </div>
          </div>
    </Frame>
  );
};

export default RecoverPassword;
