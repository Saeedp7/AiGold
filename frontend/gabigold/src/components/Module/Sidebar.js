import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { CSSTransition } from 'react-transition-group';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faBagShopping, faCircleQuestion, faFileAlt, faChartPie, faDoorOpen, faTimes, faChevronLeft, faChevronDown, faBars, faKey, faAddressCard, faEnvelope, faEnvelopeOpen, faTasks } from "@fortawesome/free-solid-svg-icons";
import SimpleBar from 'simplebar-react';
import './Sidebar.css';
import { useDispatch, useSelector } from "react-redux";
import { logout } from '../../store/actions/authActions';
import UserIcon from '../../assets/images/gabi.png'

const Sidebar = () => {
  const location = useLocation();
  const { pathname } = location;
  const [show, setShow] = useState(false);
  const [expandedItem, setExpandedItem] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user); 

  const onCollapse = () => setShow(!show);

  const handleExpand = (item) => {
    setExpandedItem(expandedItem === item ? null : item);
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const NavItem = ({ title, link, icon, badgeText, onClick }) => {
    const navItemClassName = link === pathname ? "active" : "";
    return (
      <li className={`nav-item ${navItemClassName}`} onClick={() => { setShow(false); if (onClick) onClick(); }}>
        <Link to={link} className="nav-link d-flex justify-content-between align-items-center">
          <span>
            {icon ? <span className="sidebar-icon"><FontAwesomeIcon icon={icon} /></span> : null} {" "}
            <span className="sidebar-text">{title}</span>
          </span>
          {badgeText ? (
            <span className="badge badge-md notification-count ms-2 bg-black">{badgeText}</span>
          ) : null}
          <FontAwesomeIcon icon={faChevronLeft} className="ms-2 arrow-icon" />
        </Link>
      </li>
    );
  };

  const CollapsableNavItem = ({ eventKey, title, icon, children }) => {
    const isOpen = expandedItem === eventKey;

    return (
      <li className={`nav-item accordion-item font-fa ${isOpen ? "expanded" : ""}`}>
        <button className="accordion-button nav-link d-flex justify-content-between align-items-center" onClick={() => handleExpand(eventKey)}>
          <span>
            <span className="sidebar-icon"><FontAwesomeIcon icon={icon} /></span>{" "}
            <span className="sidebar-text">{title}</span>
          </span>
          <FontAwesomeIcon icon={isOpen ? faChevronDown : faChevronLeft} className="ms-2 arrow-icon" />
        </button>
        <div className={`accordion-collapse collapse ${isOpen ? "show" : ""}`}>
          <ul className="accordion-body nav flex-column">
            {children}
          </ul>
        </div>
      </li>
    );
  };

  return (
    <>
      <div className="navbar navbar-expand navbar-dark bg-transparent px-4 d-md-none justify-content-between font-fa" dir="ltr">
        <Link className="navbar-brand me-3 me-lg-5 pt-2" to="/">
          <img src={require("../../assets/images/blogo2.png")} className="navbar-brand-light" alt="GabiGoldGallery" style={{height:"5vh"}}/>
        </Link>
        <button className="border-0 bg-transparent" aria-controls="main-navbar" onClick={onCollapse}>
          <span className="navbar-toggler-icon">
            <FontAwesomeIcon icon={faBars} />
          </span>
        </button>
      </div>
      <CSSTransition timeout={300} in={show} classNames="sidebar-transition">
        <SimpleBar className={`collapse ${show ? "show" : ""} sidebar d-md-block bg-white`}>
          <div className="sidebar-inner px-4 pt-3">
            <div className="user-card d-flex d-md-none align-items-center justify-content-between justify-content-md-center pb-4">
              <div className="d-flex align-items-center">
                <div className="user-avatar lg-avatar ms-4">
                  <img src={UserIcon} className="card-img-top rounded-circle border-white" alt="User" style={{height:'7vh'}}/>
                </div>
                <div className="d-block ms-2">
                  <h6>{user?.first_name || "بدون نام"} {user?.last_name}</h6>
                </div>
              </div>
              <button className="btn btn-link collapse-close d-md-none" onClick={onCollapse}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <Link to="/" className="navbar-brand me-0 overflow-hidden py-1 d-none d-lg-block text-center">
              <img src={require("../../assets/images/blogo2.png")} alt="GabiGoldGallery" className="image-fluid" style={{height:"10vh"}}/>
            </Link>
            <ul className="nav flex-column pt-3 pt-md-0 pe-2">
              <NavItem title="پیشخوان" link="/panel" icon={faHome} />
              <CollapsableNavItem eventKey="profile" title="اطلاعات حساب" icon={faUser}>
              <NavItem title="اطلاعات فردی" icon={faAddressCard} link="/panel/profile" />
              <NavItem title="تغییر رمز عبور" icon={faKey} link="/panel/changepassword" />
              </CollapsableNavItem>
              <NavItem title="سفارش‌ها" link="/panel/orders" badgeText="جدید" icon={faBagShopping} />
              <CollapsableNavItem eventKey="support" title="پشتیبانی" icon={faCircleQuestion}>
                <NavItem title="درخواست‌ها" link="/panel/tickets" icon={faEnvelope}/>
                <NavItem title="ارسال درخواست" link="/panel/send-ticket" icon={faEnvelopeOpen}/>
              </CollapsableNavItem>
              {user && (user.is_staff || user.is_admin) && (
                <>
                  <CollapsableNavItem eventKey="shop" title="فروشگاه" icon={faFileAlt}>
                    <NavItem title="دسته بندی ها" link="/panel/category" />
                    <NavItem title="محصولات" link="/panel/productlist" />
                    <NavItem title="سفارشات" link="/panel/orderslist" />
                    <NavItem title="ثبت محصول حدید" link="/panel/addproduct" />
                  </CollapsableNavItem>
                  <NavItem title="لیست درخواست‌ها" link="/panel/alltickets" icon={faCircleQuestion} />
                  <NavItem title="لیست نظرات" link="/panel/allreviews" icon={faCircleQuestion} />
                  <NavItem title="کاربران" icon={faAddressCard} link="/panel/users/" />
                  <NavItem link="/panel/analytics" title="آمار و ارقام" icon={faChartPie} />

                  {/* Add Cron Jobs Trigger */}
                  <NavItem title="Cron Jobs" link="/panel/cronjobs" icon={faTasks} />
                </>
              )}
              <NavItem title="خروج" icon={faDoorOpen} onClick={handleLogout} />
            </ul>
          </div>
        </SimpleBar>
      </CSSTransition>
    </>
  );
};

export default Sidebar;
