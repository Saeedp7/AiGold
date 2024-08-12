import React from "react"; 
import { Link } from "react-router-dom";
const MainContent = (props) => {


  return (
    <div className="Content">
      <div>
        <div className="text-white text-decoration-none fw-400 ps-md-4 ms-4">
          <Link
            to="/live-price"
            className="maindropdown__link h5 fw-light"
          >
            Price قیمت لحظه ای طلا &gt;
          </Link> 
        </div>
      </div>
    </div>
  );
};

export default MainContent;
