// src/utils/axiosInterceptor.js

import axios from 'axios';
import { store } from '../../store/configureStore';
import { toast } from 'react-toastify';

// Axios instance configured with the backend base URL
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  withCredentials: true,
});

// Extract CSRF token from cookie
const getCSRFToken = () => {
  const match = document.cookie.match(/(^|;\s*)csrftoken=([^;]+)/);
  return match ? decodeURIComponent(match[2]) : null;
};

// Attach the access token to every request if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    if (['post', 'put', 'patch', 'delete'].includes((config.method || '').toLowerCase())) {
      const csrfToken = getCSRFToken();
      if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle expired tokens and logout users on failure
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');

      if (refreshToken) {
        try {
          const res = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/users/token/refresh/`,
            { refresh: refreshToken }
          );
          localStorage.setItem('access_token', res.data.access);
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          store.dispatch({ type: 'LOGOUT' });
          toast.error('نشست شما منقضی شده است. لطفاً دوباره وارد شوید.');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      store.dispatch({ type: 'LOGOUT' });
      toast.error('نشست شما منقضی شده است. لطفاً دوباره وارد شوید.');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
