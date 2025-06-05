import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { Nav, Navbar, Container } from "react-bootstrap";
import axiosInstance from "../utils/axiosinterceptor";
import Cart from "./Cart";
import ProfileDropdown from "./Profile";
import Search from "./Search";
import GoldPriceCalculator from "../../Pages/Calculator";
import { Link } from "react-router-dom";
import { BACKEND_URL } from "../utils/api";

export default function NavbarTop(props) {
  const [goldPrice, setGoldPrice] = useState(null);
  const [showSearch, setShowSearch] = useState(false); // State to manage search modal visibility

  const fetchGoldPrice = async () => {
    try {
      const response = await axiosInstance.get(`${BACKEND_URL}/shop/day-price`);
      if (response.data.length > 0) {
        setGoldPrice(response.data[7].price); // Assuming the first item holds the latest price
      }
    } catch (error) {
      console.error("Error fetching gold price:", error);
    }
  };

  useEffect(() => {
    fetchGoldPrice(); // Fetch initially

    const interval = setInterval(() => {
      fetchGoldPrice(); // Fetch every 5 seconds
    }, 5000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <Navbar variant="dark" expanded className="flex-wrap mt-2 border-bottom">
      <ToastContainer
        position="top-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Container fluid className="p-1">
        <div className="d-flex">
          <Nav>
            <ProfileDropdown />
          </Nav>
          <Nav>
            <Cart />
          </Nav>
          <Nav>
            <Link
              className="nav-link px-0 position-relative link border-0 bg-transparent"
              onClick={() => setShowSearch(true)} // Open search modal on click
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="1"
                stroke="black"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
                <path d="M21 21l-6 -6"></path>
              </svg>{" "}
            </Link>
          </Nav>
          <Nav>
            <GoldPriceCalculator />
          </Nav>
          <Nav className="navbar font-fa me-4" dir="rtl">
            قیمت هر گرم طلا :{" "}
            {goldPrice !== null
              ? `${Math.round(goldPrice).toLocaleString("fa-IR")} تومان`
              : "در حال بارگذاری..."}
          </Nav>
        </div>
      </Container>
      <Search show={showSearch} onHide={() => setShowSearch(false)} />
    </Navbar>
  );
}
