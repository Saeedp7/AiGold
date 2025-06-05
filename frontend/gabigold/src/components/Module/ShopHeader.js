import React, { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import DropdownMenu from "./dropdown";
import { ToastContainer } from "react-toastify";
import Cart from "./Cart";
import { useSelector, useDispatch } from "react-redux";
import { fetchCategories } from "../../store/actions/categoryActions";
import ProfileDropdown from "./Profile";
import Search from "./Search"; 
import GoldPriceCalculator from "../../Pages/Calculator";
import axiosInstance from "../utils/axiosinterceptor";
import { BACKEND_URL } from "../utils/api";

const Shop = (props) => {
  const [showSearch, setShowSearch] = useState(false); // State to manage search modal visibility
  const [goldPrice, setGoldPrice] = useState(null);
  const categories = useSelector((state) => state.categories.data);
  const dispatch = useDispatch();

  const fetchGoldPrice = async () => {
    try {
      const response = await axiosInstance.get(`${BACKEND_URL}/shop/day-price`);
      if (response.data.length > 0) {
        setGoldPrice(response.data[7].price); // Assuming first item holds the latest price
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

  useEffect(() => {
    if (!categories.length) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

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
            <nav className="navbar navbar-dark font-fa" dir="rtl" style={{fontSize:"1.2vh"}}>
              قیمت هر گرم طلا :{" "}
              {goldPrice !== null
                ? `${Math.round(goldPrice).toLocaleString("fa-IR")} تومان`
                : "در حال بارگذاری..."}
            </nav>
            <nav className="navbar navbar-dark" dir="rtl">
              <ul
                className="navbar-nav ms-lg-4 order-lg-2 flex-row lh-1"
                style={{ paddingRight: "0" }}
              >
                <li className="nav-item order-lg-last ms-lg-3 me-lg-0 ps-lg-1 pe-lg-0 j2store_cart_module_124">
                  <div className="j2store-minicart-button">
                    <span className="cart-item-info">
                      <a
                        className="nav-link px-0 position-relative link border-0 bg-transparent"
                        onClick={() => setShowSearch(true)} 
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', zIndex: 100000 }}
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
                          className="search-icon-animation"
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
      <Search show={showSearch} onHide={() => setShowSearch(false)} />

      <Outlet />
      <footer id="footer" className="pt-5 mt-3 mt-md-5 fs-10 sticky-bottom">
        <div className="container-fluid overflow-hidden">
          <div className="row gx-sm-5 justify-content-sm-between align-items-baseline">
            <div className="col-auto">&copy; 2025 GabiGoldGallery</div>
            <div className="col-auto me-5 px-0">
              <a
                href="https://www.saeedp7.com/"
                target="_blank"
                rel="noreferrer"
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
