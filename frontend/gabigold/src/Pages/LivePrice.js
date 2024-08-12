import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Frame from "../components/Module/Frame";
import "../css/custom.css"; // Custom styling
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSun,
  faCloudSun,
  faCloudRain,
  faSnowflake,
  faCoins,
  faEuroSign,
  faDollarSign,
} from "@fortawesome/free-solid-svg-icons";
import icon1 from "../assets/images/tamam.png";
import goldbar from "../assets/images/goldbar.png";
import pattern from "../assets/images/pattern.png";
import Logo from "../assets/images/blogo2.png";
import axiosInstance from "../components/utils/axiosinterceptor";
import { BACKEND_URL } from "../components/utils/api";

const LivePriceComponent = () => {
  const [prices, setPrices] = useState([]);
  const [weather, setWeather] = useState(null);
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [currentDay, setCurrentDay] = useState("");

  useEffect(() => {
    fetchPrices();
    fetchWeather();
    updateDateTime();
    const intervalId = setInterval(updateDateTime, 60000); // Update time every second

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

  const fetchPrices = async () => {
    try {
      const response = await axiosInstance.get(`${BACKEND_URL}/shop/day-price`);
      setPrices(response.data);
    } catch (error) {
      console.error("Error fetching prices:", error);
    }
  };

  const fetchWeather = async () => {
    try {
      const apiKey = "4d723d0d3d102c4081078a6c2bba6279";
      const response = await axiosInstance.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=29.6060218&lon=52.5378041&appid=${apiKey}&units=metric`,
        {
          withCredentials: false, // Ensure credentials are not sent
        }
      );
      console.log(response.data);
      setWeather(response.data);
    } catch (error) {
      console.error("Error fetching weather:", error);
    }
  };

  const updateDateTime = () => {
    const now = new Date();
    const dayNames = [
      "یکشنبه",
      "دوشنبه",
      "سه‌شنبه",
      "چهارشنبه",
      "پنج‌شنبه",
      "جمعه",
      "شنبه",
    ];
    const persianDate = new Intl.DateTimeFormat("fa-IR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(now);
    setCurrentDay(dayNames[now.getDay()]);
    setCurrentDate(persianDate);
    setCurrentTime(
      now.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })
    );
  };

  const getWeatherIcon = () => {
    if (!weather) return faSun; // Default icon
    console.log(weather);
    const weatherId = weather.weather[0].id;
    if (weatherId >= 200 && weatherId < 600) return faCloudRain;
    if (weatherId >= 600 && weatherId < 700) return faSnowflake;
    if (weatherId >= 800 && weatherId < 804) return faCloudSun;
    return faSun;
  };

  const getPriceItem = (slug) => {
    const item = prices.find((p) => p.slug === slug);
    return item ? parseInt(item.price).toLocaleString("fa-IR") : "ناموجود";
  };

  return (
    <Frame noimage isVisible={true}>
    <div className="frame-container">
      <Container className="price-container font-fa d-md-block" dir="rtl">
        {/* Header Section */}
        <Row className="justify-content-center">
          <Col xs={10} className="text-center">
            <div className="header-section">
              <div className="header-left d-flex flex-column">
                <span className="h4">گالری گابی</span>
                <p className="p-0 m-0">{currentDay}</p>
                <p className="m-0">{currentDate}</p>
              </div>
              <div className="header-right d-flex flex-column border rounded p-2">
                <div>
                  <FontAwesomeIcon icon={getWeatherIcon()} />
                </div>
                <br />
                <span>{currentTime}</span>
              </div>
            </div>
          </Col>
        </Row>

        {/* Price List Section */}
        <Row className="price-list justify-content-center">
          <Col xs={10} className="text-center">
            <div className="price-item bg-light">
              <div className="d-flex align-items-center justify-content-end">
                <img src={icon1} alt="coin" className="price-icon" />
                <span>سکه امامی</span>
              </div>
              <div className="text-right price-value">
                {getPriceItem("sekkeh")} تومان
              </div>
            </div>
            <div className="price-item">
              <div className="d-flex align-items-center justify-content-end">
                <div className="price-dot"></div>
                <span>نیم سکه</span>
              </div>
              <div className="text-right price-value">
                {getPriceItem("nim")} تومان
              </div>
            </div>
            <div className="price-item">
              <div className="d-flex align-items-center justify-content-end">
                <div className="price-dot"></div>
                <span>ربع سکه</span>
              </div>
              <div className="text-right price-value">
                {getPriceItem("rob")} تومان
              </div>
            </div>
            <div className="price-item">
              <div className="d-flex align-items-center justify-content-end">
                <div className="price-dot"></div>
                <span>سکه گرمی</span>
              </div>
              <div className="text-right price-value">
                {getPriceItem("gerami")} تومان
              </div>
            </div>
            <div className="price-item bg-light">
              <div className="d-flex align-items-center justify-content-end">
                <img src={goldbar} alt="goldbar" className="price-icon" />
                <span>یک مثقال طلای 17 عیار</span>
              </div>
              <div className="text-right price-value">
                {getPriceItem("abshodeh")} تومان
              </div>
            </div>
            <div className="price-item bg-light">
              <div className="d-flex align-items-center justify-content-end">
                <img src={goldbar} alt="goldbar" className="price-icon" />
                <span>یک گرم طلای 18 عیار</span>
              </div>
              <div className="text-right price-value">
                {getPriceItem("18ayar")} تومان
              </div>
            </div>
          </Col>
        </Row>

        {/* Footer Section */}
        <Row className="m-2 justify-content-center">
        <Col xs={10} className="text-center">
          <img src={pattern} className="img-fluid " alt="pattern" />
          </Col>
        </Row>
        <Row className="footer-info text-center justify-content-center mt-0">
          <Col xs={2}>
            <FontAwesomeIcon icon={faCoins} /> اونس
            <br /> {getPriceItem("usd_xau")} $
          </Col>
          <Col xs={2} className="border-end border-start rounded">
            <FontAwesomeIcon icon={faEuroSign} />
            یورو <br /> {getPriceItem("eur")} تومان
          </Col>
          <Col xs={2}>
            <FontAwesomeIcon icon={faDollarSign} /> دلار
            <br /> {getPriceItem("usd")} تومان
          </Col>
        </Row>

        {/* Contact Info */}
        <Row className="price-info text-center contact-info mt-4 mt-md-0 justify-content-center">
        <Col className="text-center d-md-none">
            <img src={Logo} className="img-fluid w-md-50" alt="Gabi Logo" />
          </Col>
          <Col className="text-start lh-1" dir="ltr">
            <p className="fw-bold m-0">CONTACT US</p>
            <span>0917 368 4122 </span><br /><span> 0713 634 0201</span>
            <p className="fw-bold m-0 mt-1">EMAIL</p>
            <p>info@gabigoldgallery.com</p>
          </Col>
          <Col className="text-start lh-1">
            <p className="fw-bold m-0">ADDRESS</p>
            <p className="my-1">Ma'ali Abad Street, Berlian Building, Shiraz</p>
            <p className="fw-bold m-0">WEBSITE</p>
            <p>www.gabigoldgallery.com</p>
          </Col>
          <Col className="text-center">
          <Col xs={10} className="text-center">
            <img src={Logo} className="img-fluid me-5 me-md-0" alt="Gabi Logo" />
            </Col>
          </Col>
        </Row>

        <Row className="m-2 justify-content-center">
        <Col xs={10} className="text-center">
          <img src={pattern} className="img-fluid vw-100" alt="pattern" />
          </Col>
        </Row>
      </Container>
    </div>
  </Frame>
);
};

export default LivePriceComponent;
