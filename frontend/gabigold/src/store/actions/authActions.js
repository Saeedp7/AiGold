import axiosInstance from '../../components/utils/axiosinterceptor';
import { BACKEND_URL } from '../../components/utils/api';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import { cartActions } from '../reducers/cartReducer';

export const sendOTP = (data) => async dispatch => {
    try {
        const response = await axiosInstance.post(`${BACKEND_URL}/users/send_otp/`, data);
        return { success: true, data: response.data };
    } catch (error) {
        if (error.response.data.phone_number[0]=== "Phone number already exists.") {
            toast.error('با این شماره قبلا ثبت نام شده است');
        }
        return { success: false, error: error};
    }
};

export const verifyOTP = (data) => async dispatch => {
    try {
        const response = await axiosInstance.post(`${BACKEND_URL}/users/verify_otp/`, data);
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response.data };
    }
};

export const register = (userData) => async dispatch => {
    try {
        const response = await axiosInstance.post(`${BACKEND_URL}/users/register/`, userData);
        dispatch({ type: 'REGISTER_SUCCESS', payload: response.data });
        return { success: true, data: response.data };
    } catch (error) {
        if (error.response.data.non_field_errors) {
            if (error.response.data.non_field_errors[0]=== "OTP has expired") {
                toast.error('کد اعتبار سنجی منقضی شده است');
            }
            if (error.response.data.non_field_errors[0]=== "Code Melli is already in use") {
                toast.error('این کدملی قبلا ثبت نام کرده است');
            }
            if (error.response.data.non_field_errors[0]=== "Code Melli does not belong to the provided phone number") {
                toast.error('این کدملی متعلق به شماره همراه نمی باشد');
            }
        } else {
            toast.error('خطا در ثبت نام');
        }
        dispatch({ type: 'REGISTER_FAIL', payload: error.response.data });
        return { success: false, error: error.response.data };
    }
};

export const login = (userData) => async dispatch => {
    try {
        const response = await axiosInstance.post(`${BACKEND_URL}/users/login/`, userData);
        const storage = userData.rememberMe ? localStorage : sessionStorage;
        dispatch({ type: 'LOGIN_SUCCESS', payload: response.data.user });
        storage.setItem('access_token', response.data.access);
        storage.setItem('refresh_token', response.data.refresh);
        const { exp } = jwtDecode(response.data.access);
        const expirationTime = (exp * 1000) - Date.now();
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime);
        const cartResponse = await axiosInstance.get(`${BACKEND_URL}/cart/cart/`, {
            headers: { 'Authorization': `Bearer ${response.data.access}` }
        });
        dispatch(cartActions.setCart(cartResponse.data));  // Dispatch setCart action with cart data
        toast.success('ورود موفقیت آمیز بود');
        return { success: true, data: response.data };
    } catch (error) {
        if (error.response.data.non_field_errors) {
            if (error.response.data.non_field_errors[0]=== "Invalid phone number or password") {
                console.log(error.response.data.non_field_errors[0])
                toast.error('شماره همراه یا رمز عبور وارد شده صحیح نمی باشد');
            }
        }
        dispatch({ type: 'LOGIN_FAIL', payload: error.response.data });
        return { success: false, error: error.response.data };
    }
};

export const logout = () => dispatch => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    dispatch({ type: 'LOGOUT' });
    toast.success('خروج موفقیت آمیز بود');
    window.location.href = '/login'; 
};

export const requestPasswordReset = (phoneNumber) => async dispatch => {
    try {
        const response = await axiosInstance.post(`${BACKEND_URL}/users/reset_password/`, { phone_number: phoneNumber });
        toast.success('رمز عبور جدید با موفقیت ارسال شد');
        return { success: true, data: response.data };
    } catch (error) {
        if (error.response.data.detail) {
            if (error.response.data.detail=== "User with this phone number does not exist") {
                toast.error('کاربری با شماره ارسال شده وجود ندارد');
            }
        }
        return { success: false, error: error.response.data };
    }
};

