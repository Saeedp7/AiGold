import React, { useEffect } from 'react';
import './Sidebar.css';

const Preloader = ({ show }) => {
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="preloader">
      <div className="spinner"></div>
    </div>
  );
};

export default Preloader;
