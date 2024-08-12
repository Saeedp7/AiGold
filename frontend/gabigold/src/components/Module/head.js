import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import DropdownMenu from "./dropdown";
import { fetchCategories } from "../../store/actions/categoryActions";
import { useSelector, useDispatch } from "react-redux";
import Cart from "./Cart";
import ProfileDropdown from "./Profile";

function Header(props) {
  const [isNavVisible, setNavVisibility] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const categories = useSelector((state) => state.categories.data);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!categories || categories.length === 0) {
      dispatch(fetchCategories());
    }
    const mediaQuery = window.matchMedia("(max-width: 991px)");
    const handleMediaQueryChange = (mediaQuery) => {
      setIsSmallScreen(mediaQuery.matches);
    };
    mediaQuery.addListener(handleMediaQueryChange);
    return () => mediaQuery.removeListener(handleMediaQueryChange);
  }, [dispatch, categories]);

  const toggleNav = () => {
    setNavVisibility(!isNavVisible);
  };

  return (
    <header id="header" className="flex-grow-1">
      <nav className="navbar navbar-expand-lg flex-wrap navbar-dark">
        <div className="container-fluid" style={{ paddingBottom: "0" }}>
          <Link
            to="/"
            className="navbar-brand me-0 d-flex flex-column overflow-hidden me-auto"
          >
            <img
              src={require("../../assets/images/wlogo2.png")}
              alt="GabiGoldGallery"
              className="d-inline-block align-top img-fluid"
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
                </a>
                  <Cart main />
              </span>
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
            <span className="navbar-toggler-icon"></span>
          </button>
          <div id="headerMenuDiv" className="order-1">
            <div
              className={`collapse navbar-collapse ${
                isNavVisible ? "show" : ""
              }`}
            >
              <ul className="navbar-nav me-lg-0 order-lg-2 lh-1">
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
            {isSmallScreen && isNavVisible && (
              <div className="mt-3 mt-lg-4 order-3" id="headerEnd">
                <div
                  className="navbar-collapse collapse show"
                  id="headerNavbarCollapse"
                >
                  <ul className="navbar-nav">
                    <li className="nav-item">
                      <a href="/rules" className="nav-link">
                        Rules / قوانین
                      </a>
                    </li>
                    <li className="nav-item">
                      <a href="/about-us" className="nav-link">
                        About / درباره
                      </a>
                    </li>
                    <li className="nav-item">
                      <a href="/contact-us" className="nav-link">
                        Contact / تماس
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
        <DropdownMenu data={categories} />
      </nav>
    </header>
  );
}

export default Header;
