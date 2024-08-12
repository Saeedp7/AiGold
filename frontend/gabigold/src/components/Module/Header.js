import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import DropdownMenu from "./dropdown";
import { fetchCategories } from "../../store/actions/categoryActions";
import { useSelector, useDispatch } from "react-redux";
import Cart from "./Cart";
import ProfileDropdown from "./Profile";
import Search from "./Search";
import "../../css/animate.css"

function Header(props) {
  const [isNavVisible, setNavVisibility] = useState(false);
  const [showSearch, setShowSearch] = useState(false); // State to manage search modal visibility
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 992);
  const categories = useSelector((state) => state.categories.data);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!categories || categories.length === 0) {
      dispatch(fetchCategories());
    }
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 992);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch, categories]);

  const toggleNav = () => {
    setNavVisibility(!isNavVisible);
  };

  return (
    <header id="header" className="flex-grow-1 animate__animated animate__fadeIn">
      <nav className="navbar navbar-expand-lg flex-wrap navbar-dark animate__animated animate__fadeInDown">
        <div className="container-fluid" style={{ paddingBottom: "0" }}>
          <Link
            to="/"
            className="navbar-brand me-0 d-flex flex-column overflow-hidden me-auto"
          >
            <img
              src={require("../../assets/images/wlogo2.png")}
              alt="GabiGoldGallery"
              className="d-inline-block align-top img-fluid logo-animation"  // Added animation class for logo
              style={{ height: "auto" }}
            />
          </Link>
          <ul className="navbar-nav me-3 me-lg-0 ms-lg-4 order-lg-2 flex-row lh-1">
            <li className="nav-item order-lg-last ms-lg-3 me-3 me-lg-0 me-2 ps-lg-1 pe-2 pe-lg-0 j2store_cart_module_124">
              <ProfileDropdown main />
            </li>
            <li className="order-lg-2 ms-lg-3 ps-lg-1 pe-lg-0 nav-item">
              <span className="cart-item-info">
                <a
                  role="button"
                  className="nav-link px-0 position-relative link"
                  href="#"
                  data-bs-toggle="modal"
                  data-bs-target="#cartModal"
                >
                  <Cart main />
                </a>
              </span>
            </li>
            <li className="nav-item order-lg-first ms-lg-3 ps-lg-1 j2store_cart_module_124">
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
                          stroke="white"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="search-icon-animation"  // Added animation class for search icon
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                          <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
                          <path d="M21 21l-6 -6"></path>
                        </svg>{" "}
                      </a>
                    </span>
                  </div>
                </li>
          </ul>
          <button
            className="navbar-toggler border-0 rounded-0 ps-2 py-2 pe-0 text-reset lh-0 shadow-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#headerNavbarCollapse"
            aria-controls="headerNavbarCollapse"
            aria-expanded={isNavVisible ? "true" : "false"}
            aria-label="Toggle navigation"
            onClick={toggleNav}
          >
            <span className="navbar-toggler-icon toggle-animation"></span>
          </button>
          <div id={isSmallScreen ? (isNavVisible ? "headerMenuDiv" : "") : "headerEnd"} className="order-1">
            <div className={`collapse navbar-collapse ${isNavVisible ? "show" : ""}`}>
              <ul className="navbar-nav me-lg-0 order-lg-2 lh-1 animate__animated animate__fadeInLeft">
                <li className="nav-item">
                  <NavLink to="/rules" className="nav-link">
                    Rules / قوانین
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/about-us" className="nav-link">
                    About / درباره
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/contact-us" className="nav-link">
                    Contact / تماس
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <Search show={showSearch} onHide={() => setShowSearch(false)} /> {/* Integrate Search modal */}
        <DropdownMenu data={categories} />
      </nav>
    </header>
  );
}

export default Header;
