import React, { useState } from "react";
import "./dropmenu.css";
import { Link } from "react-router-dom";

function DropdownMenu(props) {
  const [activeMenu, setActiveMenu] = useState(false);
  const { data } = props;
  const location = props.location;

  const handleClick = () => {
    setActiveMenu(!activeMenu);
  };

  const textStyle = {
    color: location ? 'black' : 'white',
  };

  const itemList = (data) => {
    return data.map((item) => (
      <div className="maindropdown__item" key={item.id}>
        <Link to={`/category/${item.id}`} style={textStyle} className="maindropdown__link h5 fw-light">
          {item.name}
        </Link>
        <svg className="mt-1 ms-2 d-none d-md-block" preserveAspectRatio="xMidYMin" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 7 14 12 9 17"></polyline>
        </svg>
      </div>
    ));
  };

  if (!data || data.length === 0) return <p>Can not find any data, sorry</p>;

  return (
    <div className="container-fluid">
      <div className="nav-link d-inline-flex align-items-center">
        <nav className={`maindropdown ${activeMenu ? 'active' : ''}`} style={location ? { marginLeft: "-4vh" } : { marginLeft: "1vh" }}>
          <button className="nav-link btn btn-link shadow-none mt-5" onClick={handleClick} style={{ pointerEvents: "all", ...textStyle }}>
            PRODUCTS / ویترین
            <svg className="d-none d-lg-block" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 7 14 12 9 17"></polyline>
            </svg>
          </button>
          <div className={`maindropdown ${activeMenu ? 'active' : ''}`}>
            {activeMenu && <div className="maindropdown__items">{itemList(data)}</div>}
          </div>
        </nav>
      </div>
    </div>
  );
}

export default DropdownMenu;
