// src/utils/axiosInterceptor.js

import axios from 'axios';
import { store } from '../../store/configureStore';
import { logout } from '../../store/actions/authActions';

// Create an Axios instance
const axiosInstance = axios.create();
    console.log("Salam")
axiosInstance.interceptors.response.use(
  (response) => {
    return response; // If the response is successful, just return it
  },
  (error) => {
    const originalRequest = error.config;
    console.log(error.response)

    // If the error response is 401, it means the token has expired
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Dispatch the logout action to clear the user's state
      store.dispatch(logout());

      // Redirect to the login page
      window.location.href = '/login';

      return Promise.reject(error);
    }

    // For any other error, reject the promise with the error object
    return Promise.reject(error);
  }
);

export default axiosInstance;
