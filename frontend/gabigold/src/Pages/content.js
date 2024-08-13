import React from "react"; 
import { Link } from "react-router-dom";

const MainContent = (props) => {
  return (
    <div className="content-container d-flex align-items-end justify-content-start overflow-hidden" style={{ minHeight: '45vh' }}>
      <div className="text-white text-decoration-none ps-md-4 ms-4 mb-5 pt-">
        <Link
          to="/live-price"
          className="maindropdown__link h6 fw-light text-uppercase"
          style={{ textDecoration: 'none', color: 'white', fontSize: '1.2rem' }}
        >
          قیمت لحظه ای طلا <span style={{ fontSize: '1.0rem' }}>&gt;</span>
        </Link> 
      </div>
    </div>
  );
};

export default MainContent;
