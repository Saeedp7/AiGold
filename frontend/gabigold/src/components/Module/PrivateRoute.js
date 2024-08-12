import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const location = useLocation();

    if (!isAuthenticated) {
        // Store the current location before redirecting to login
        localStorage.setItem('next', location.pathname + location.search);
        return <Navigate to="/login" />;
    }

    return children;
};

export default PrivateRoute;
