// src/Pages/GoldPriceCalculatorPage.js

import React, { useState, useEffect } from "react";
import { Row, Col, Form } from "react-bootstrap";
import axiosInstance from "../components/utils/axiosinterceptor";
import { BACKEND_URL } from "../components/utils/api";


const GoldPriceCalculatorPage = () => {
  const [currentGoldPrice, setCurrentGoldPrice] = useState(0);
  const [weight, setWeight] = useState(10); // Default weight
  const [wagePercentage, setWagePercentage] = useState(23); // Default wage percentage
  const [profitPercentage, setProfitPercentage] = useState(7); // Default profit percentage
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
    if (currentGoldPrice) {
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
    <div className="container my-5 font-fa" dir="rtl">
      <h1 className="text-center mb-4">محاسبه آنلاین قیمت طلا</h1>
      <h5 className="text-center">قیمت روز طلا: {currentGoldPrice.toLocaleString()} تومان</h5>
      <Form>
        <Row className="mb-3 justify-content-center flex-nowrap me-3">
          <Col md={4}>
            <Form.Group controlId="goldWeight">
              <Form.Label>وزن طلا (گرم)</Form.Label>
              <Form.Control
                type="number"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value))}
                className="w-50"
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="wagePercentage">
              <Form.Label>اجرت ساخت (%)</Form.Label>
              <Form.Control
                type="number"
                value={wagePercentage}
                onChange={(e) => setWagePercentage(parseFloat(e.target.value))}
                className="w-50"
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="profitPercentage">
              <Form.Label>سود فروش (%)</Form.Label>
              <Form.Control
                type="number"
                value={profitPercentage}
                onChange={(e) => setProfitPercentage(parseFloat(e.target.value))}
                className="w-50"
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>
      <h5 className="mt-4">نتایج محاسبه:</h5>
      <Row className="mb-2">
        <Col>قیمت طلای محصول:</Col>
        <Col className="text-end">{(weight * currentGoldPrice).toLocaleString()} تومان</Col>
      </Row>
      <Row className="mb-2">
        <Col>اجرت ساخت ({wagePercentage}%):</Col>
        <Col className="text-end">{((weight * currentGoldPrice) * (wagePercentage / 100)).toLocaleString()} تومان</Col>
      </Row>
      <Row className="mb-2">
        <Col>سود فروش ({profitPercentage}%):</Col>
        <Col className="text-end">{(((weight * currentGoldPrice) + ((weight * currentGoldPrice) * (wagePercentage / 100))) * (profitPercentage / 100)).toLocaleString()} تومان</Col>
      </Row>
      <Row className="mb-2">
        <Col>مالیات (9%):</Col>
        <Col className="text-end">{((((weight * currentGoldPrice) * (wagePercentage / 100)) + (((weight * currentGoldPrice) + ((weight * currentGoldPrice) * (wagePercentage / 100))) * (profitPercentage / 100))) * 0.09).toLocaleString()} تومان</Col>
      </Row>
      <Row className="mt-3">
        <Col>مجموع:</Col>
        <Col className="text-end">{finalPrice.toLocaleString()} تومان</Col>
      </Row>
    </div>
  );
};

export default GoldPriceCalculatorPage;
