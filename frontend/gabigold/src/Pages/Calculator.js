import React, { useState, useEffect } from "react";
import { Row, Col, Nav, Modal, Button, Form, InputGroup } from "react-bootstrap";
import axiosInstance from "../components/utils/axiosinterceptor";
import { BACKEND_URL } from "../components/utils/api";
import icon from "../assets/images/calc.png";

const GoldPriceCalculator = () => {
  const [show, setShow] = useState(false);
  const [currentGoldPrice, setCurrentGoldPrice] = useState(0);
  const [weight, setWeight] = useState(0);
  const [wagePercentage, setWagePercentage] = useState(18);
  const [profitPercentage, setProfitPercentage] = useState(7);
  const [finalPrice, setFinalPrice] = useState(0);

  useEffect(() => {
    const fetchGoldPrice = async () => {
      try {
        const response = await axiosInstance.get(`${BACKEND_URL}/shop/gold-price/`);
        setCurrentGoldPrice(response.data.gold_price_per_gram);
      } catch (error) {
        console.error("Error fetching gold price:", error);
      }
    };
    fetchGoldPrice();
  }, []);

  useEffect(() => {
    if (currentGoldPrice && weight) {
      calculatePrice();
    }
  }, [currentGoldPrice, weight, wagePercentage, profitPercentage]);

  const calculatePrice = () => {
    const goldPrice = weight * currentGoldPrice;
    const wage = goldPrice * (wagePercentage / 100);
    const profit = (goldPrice + wage) * (profitPercentage / 100);
    const tax = (profit + wage) * 0.09;
    const totalPrice = goldPrice + wage + profit + tax;

    setFinalPrice(totalPrice);
  };

  return (
    <>
      <Nav.Item className="position-relative">
        <Nav.Link
          className="text-dark p-0"
          onClick={() => setShow(true)}
          title="محاسبه قیمت طلا"
        >
          <img src={icon} className="img-fluid" alt="calculator icon" style={{ height: "24px", width: "24px" }} />
        </Nav.Link>
      </Nav.Item>

      <Modal show={show} onHide={() => setShow(false)} centered dir="rtl" className="font-fa">
        <Modal.Header closeButton className="flex-column-reverse">
          <Modal.Title className="text-primary">محاسبه آنلاین قیمت طلا</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="calculator-header">
            <h5 className="text-center">قیمت روز طلا: {currentGoldPrice.toLocaleString()} تومان</h5>
            <h6 className="text-center text-muted">بر اساس فرمول محاسبه اتحادیه طلا</h6>
          </div>
          <Form>
            <Row className="mb-3">
              <Col xs={12} sm={6}>
                <Form.Group controlId="goldWeight" className="material-input-container">
                  <Form.Label>وزن طلا (گرم)</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(parseFloat(e.target.value))}
                      placeholder="مثال: 10"
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col xs={12} sm={6}>
                <Form.Group controlId="wagePercentage" className="material-input-container">
                  <Form.Label>اجرت ساخت (%)</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="number"
                      value={wagePercentage}
                      onChange={(e) => setWagePercentage(parseFloat(e.target.value))}
                      placeholder="مثال: 18"
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col xs={12} sm={6}>
                <Form.Group controlId="profitPercentage" className="material-input-container">
                  <Form.Label>سود فروش (%)</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="number"
                      value={profitPercentage}
                      onChange={(e) => setProfitPercentage(parseFloat(e.target.value))}
                      placeholder="مثال: 7"
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
          </Form>

          <div className="calculator-results mt-4">
            <Row className="mb-2">
              <Col>قیمت طلای محصول:</Col>
              <Col className="text-end text-primary">{Math.round(weight * currentGoldPrice).toLocaleString()} تومان</Col>
            </Row>
            <Row className="mb-2">
              <Col>اجرت ساخت:</Col>
              <Col className="text-end text-primary">{Math.round((weight * currentGoldPrice) * (wagePercentage / 100)).toLocaleString()} تومان</Col>
            </Row>
            <Row className="mb-2">
              <Col>سود فروش:</Col>
              <Col className="text-end text-primary">{Math.round(((weight * currentGoldPrice) + ((weight * currentGoldPrice) * (wagePercentage / 100))) * (profitPercentage / 100)).toLocaleString()} تومان</Col>
            </Row>
            <Row className="mb-2">
              <Col>مالیات(9%) :</Col>
              <Col className="text-end text-primary">{Math.round((((weight * currentGoldPrice) * (wagePercentage / 100)) + (((weight * currentGoldPrice) + ((weight * currentGoldPrice) * (wagePercentage / 100))) * (profitPercentage / 100))) * 0.09).toLocaleString()} تومان</Col>
            </Row>
            <Row className="mt-3">
              <Col>مجموع:</Col>
              <Col className="text-end text-primary fw-bold">{Math.round(finalPrice).toLocaleString()} تومان</Col>
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between flex-nowrap mt-3">
          <Button variant="primary" onClick={calculatePrice} className="w-50">
            محاسبه مجدد
          </Button>
          <Button variant="light" onClick={() => setShow(false)} className="w-50">
            بستن
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default GoldPriceCalculator;
