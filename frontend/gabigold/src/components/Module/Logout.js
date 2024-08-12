import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from '../../store/actions/authActions';

export const Logout = (props) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
        dispatch(logout());
        navigate('/login');
    }