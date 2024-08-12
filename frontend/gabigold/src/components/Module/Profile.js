import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faCog, faEnvelopeOpen, faSignOutAlt, faUserShield, faSignInAlt, faUserCircle, faTruckFast } from "@fortawesome/free-solid-svg-icons";
import { Nav, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/actions/authActions';
import UserIcon from '../../assets/images/gabi.png'

const ProfileDropdown = (props) => {
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <Dropdown as={Nav.Item} dir="rtl" align="end">
            <Dropdown.Toggle id="dropdown-autoclose-true" as={Nav.Link} className="p-0">
                <span className="icon icon-sm">
                <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      strokeWidth="1"
                      stroke={props.main ? "white" : "black"}
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
                      <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
                    </svg>{" "}
                </span>
            </Dropdown.Toggle>
            <Dropdown.Menu className="user-dropdown dropdown-menu-right mt-0" style={{minWidth:"25vh",zIndex:"10000", right:"1vh"}}>
                {user ? (
                    <>
                        <Dropdown.Item as={Link} to="/panel" className="fw-bold text-right dropdown-item-custom me-2 justify-content-between">
                        <div className="user-avatar">
                  <img src={UserIcon} className="card-img-top rounded-circle border-white" alt="User" style={{height:'5vh'}}/>
                </div>
                            <span className="font-small fw-bold pe-3">{user.first_name || "بدون نام"} {user.last_name}</span>
                            <FontAwesomeIcon icon={faChevronLeft} className="ms-2 arrow-icon" />
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item as={Link} to="/panel/profile" className="fw-bold text-right dropdown-item-custom me-2">
                            <FontAwesomeIcon icon={faUserCircle} className="ms-2" /> پروفایل
                        </Dropdown.Item>
                        <Dropdown.Item as={Link} to="/panel/orders" className="fw-bold text-right dropdown-item-custom me-2">
                            <FontAwesomeIcon icon={faTruckFast} className="ms-2" /> سفارش‌ها
                        </Dropdown.Item>
                        <Dropdown.Item as={Link} to="/panel/tickets" className="fw-bold text-right dropdown-item-custom me-2">
                            <FontAwesomeIcon icon={faEnvelopeOpen} className="ms-2" /> پیام‌ها
                        </Dropdown.Item>
                        <Dropdown.Item as={Link} to="/panel/send-ticket" className="fw-bold text-right dropdown-item-custom me-2">
                            <FontAwesomeIcon icon={faUserShield} className="ms-2" /> پشتیبانی
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={handleLogout} className="fw-bold text-right dropdown-item-custom me-2">
                            <FontAwesomeIcon icon={faSignOutAlt} className="text-danger ms-2" /> خروج
                        </Dropdown.Item>
                    </>
                ) : (
                    <Dropdown.Item onClick={() => navigate('/login')} className="fw-bold text-right dropdown-item-custom me-2">
                        <FontAwesomeIcon icon={faSignInAlt} className="text-danger ms-2" /> ورود
                    </Dropdown.Item>
                )}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default ProfileDropdown;
