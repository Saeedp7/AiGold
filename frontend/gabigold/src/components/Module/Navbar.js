import React from "react";
import { ToastContainer } from "react-toastify";
import { Nav, Navbar, Container } from "react-bootstrap";
import useWebSocket from "../utils/useWebSocket";
import { useState, useCallback } from "react";
import Cart from "./Cart";
import ProfileDropdown from "./Profile";
import Search from "./Search";
import GoldPriceCalculator from "../../Pages/Calculator";
import { Link } from "react-router-dom";

export default function NavbarTop(props){
    const [goldPrice, setGoldPrice] = useState();
    const [showSearch, setShowSearch] = useState(false); // State to manage search modal visibility

    const handleNewPrice = useCallback((data) => {
        setGoldPrice(data.gold_price);
      }, []);
    
      useWebSocket("ws://localhost:8000/shop/gold-price/", handleNewPrice);


  return (
    <Navbar variant="dark" expanded className="flex-warp mt-2 border-bottom">
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
<Nav><GoldPriceCalculator /></Nav>
          <Nav className="navbar font-fa me-4" dir="rtl" style={{float:"left"}}>
              قیمت هر گرم طلا :{" "}
              {goldPrice
                ? `${Math.round(goldPrice).toLocaleString("fa-IR")} تومان`
                : "Loading..."}
            </Nav>
        </div>
      </Container>
            <Search show={showSearch} onHide={() => setShowSearch(false)} /> 
      <br />
    </Navbar>
  );
};
