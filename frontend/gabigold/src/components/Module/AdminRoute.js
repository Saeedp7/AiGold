import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();

  if (!user) {
    // Store the current location before redirecting to login
    localStorage.setItem('next', location.pathname + location.search);
    return <Navigate to="/login" />;
  }

  if (!user.is_admin || !user.is_staff) {
    return <Navigate to="/forbidden" />;
  }

  return children;
};

export default AdminRoute;
