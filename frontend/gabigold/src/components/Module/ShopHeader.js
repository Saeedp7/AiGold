import React, { useState, useEffect, useCallback } from "react";
import { Outlet, Link } from "react-router-dom";
import DropdownMenu from "./dropdown";
import { ToastContainer } from "react-toastify";
import Cart from "./Cart";
import { useSelector, useDispatch } from "react-redux";
import { fetchCategories } from "../../store/actions/categoryActions";
import useWebSocket from "../utils/useWebSocket";
import ProfileDropdown from "./Profile";
import Search from "./Search"; // Import the Search component
import GoldPriceCalculator from "../../Pages/Calculator";

const Shop = (props) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [showSearch, setShowSearch] = useState(false); // State to manage search modal visibility
  const [showCalculator, setShowCalculator] = useState(false);
  const categories = useSelector((state) => state.categories.data);
  const [goldPrice, setGoldPrice] = useState();
  const dispatch = useDispatch();

  const handleNewPrice = useCallback((data) => {
    setGoldPrice(data.gold_price);
  }, []);

  useWebSocket("ws://localhost:8000/shop/gold-price/", handleNewPrice);

  useEffect(() => {
    if (!categories.length) {
      dispatch(fetchCategories());
    }

    const mediaQuery = window.matchMedia("(max-width: 991px)");
    const handleMediaQueryChange = (mediaQuery) => {
      if (mediaQuery.matches) {
        setIsSmallScreen(true);
      } else {
        setIsSmallScreen(false);
      }
    };
    mediaQuery.addListener(handleMediaQueryChange);

    return () => mediaQuery.removeListener(handleMediaQueryChange);
  }, [dispatch]);

  return (
    <main>
      <header
        id="header"
        className="fixed-top"
        style={{ height: "15vh", background: "white" }}
      >
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
        <nav className="navbar navbar-expand-lg flex-wrap navbar-light">
          <div
            className="container-fluid"
            style={{ display: "flex", flexWrap: "nowrap" }}
          >
            <Link
              to="/"
              className="navbar-brand me-0 d-flex flex-column overflow-hidden"
            >
              <img
                src={require("../../assets/images/blogo2.png")}
                alt="GabiGoldGallery"
              />
            </Link>
            <nav className="navbar navbar-dark font-fa" dir="rtl">
              قیمت هر گرم طلا :{" "}
              {goldPrice
                ? `${Math.round(goldPrice).toLocaleString("fa-IR")} تومان`
                : "Loading..."}
            </nav>
            <nav className="navbar navbar-dark" dir="rtl">
              <ul
                className="navbar-nav ms-lg-4 order-lg-2 flex-row lh-1"
                style={{ paddingRight: "0" }}
              >
                <li className="nav-item order-lg-last ms-lg-3 ps-lg-1 j2store_cart_module_124">
                  <div className="j2store-minicart-button">
                    <span className="cart-item-info">
                      <a
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
                      </a>
                    </span>
                  </div>
                </li>
                <li className="order-lg-2 ms-lg-3 ps-lg-1 pe-lg-0 nav-item">
                  <ProfileDropdown />
                </li>
                <li className="nav-item order-lg-last ms-lg-3 ps-lg-1 j2store_cart_module_124">
                  <Cart />
                </li>
                <li className="nav-item order-lg-last ms-lg-3 ps-lg-1 j2store_cart_module_124">
                <GoldPriceCalculator />
                </li>
              </ul>
            </nav>
            <div
              id="headerMenuDiv"
              className="container-fluid position-absolute start-0 end-0 pb-2 pb-md-3"
            >
              <DropdownMenu data={categories} location={true} />
            </div>
          </div>
        </nav>
      </header>
      <Search show={showSearch} onHide={() => setShowSearch(false)} /> {/* Integrate Search modal */}

      <Outlet />
      <footer id="footer" className="pt-5 mt-3 mt-md-5 fs-10 sticky-bottom">
        <div className="container-fluid overflow-hidden">
          <div className="row gx-sm-5 justify-content-sm-between align-items-baseline">
            <div className="col-auto">&copy; 2023 GabiGoldGallery</div>
            <div className="col-auto me-5 px-5">
              <a
                href="https://www.saeedp7.com/"
                target="_blank"
                className="text-decoration-none d-inline-flex align-items-center text-reset sdj"
              >
                website by Saeedp7 ↗
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Shop;
