import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageSlider from "./Slider";
import { ToastContainer } from "react-toastify";
import './card.css'; // Import your regular CSS file

function Frame({ isVisible, onClose, noimage, children }) {
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
    }
  }, [isVisible]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      navigate("..");
      if (onClose) onClose();
    }, 500); // Match the timeout with your exit animation duration
  };

  return (
    <div className="container">
      <div 
        className={`backdrop ${isAnimating ? 'backdropFadeIn' : 'backdropFadeOut'}`} 
        onClick={handleClose} 
      />
      <div className={`position-absolute top-50 start-50 translate-middle vscrolling_container card ${isAnimating ? 'fadeIn' : 'fadeOut'}`}>
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
        <div className="row flex-md-nowrap">
          {!noimage ? (
            <>
              <div className="col-lg-6 col-12 d-md-block pt-2 pb-2" style={{ minHeight: '70vh' }}>
                <ImageSlider />
              </div>
              <div className="col-lg-5 col-11 mt-md-3 d-block" dir="rtl">
                {children}
              </div>
            </>
          ) : (
            <div className="row justify-content-center ms-1 ms-md-0">
              <div className="col-9 mt-md-3 d-block" dir="rtl">
                {children}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Frame;
