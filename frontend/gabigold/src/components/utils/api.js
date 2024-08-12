import axiosInstance from './axiosinterceptor';
import { cartActions } from '../../store/reducers/cartReducer';
axiosInstance.defaults.withCredentials = true;

export const BACKEND_URL = 'http://localhost:8000'; // Adjust the URL based on your backend setup

export default class ApiService {

  static setAuthToken(token) {
    if (token) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axiosInstance.defaults.headers.common['Authorization'];
    }
  }

  static async getCart() {
    const token = sessionStorage.getItem('access_token') || localStorage.getItem('access_token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

    try {
      const response = await axiosInstance.get(`${BACKEND_URL}/cart/cart/`, { headers });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error("Network error");
    }
  }

  static async addToCart(dispatch, product_id, quantity) {
    const token = sessionStorage.getItem('access_token') || localStorage.getItem('access_token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    
    try {
      const response = await axiosInstance.post(`${BACKEND_URL}/cart/cart/`, {
        product_id,
        quantity
      }, { headers });
      
      dispatch(cartActions.addToCart(response.data));
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        return { error: error.response.data.error };
      } else {
        return { error: "Network error" };
      }
    }
  }

  static async updateCartItem(dispatch, cartItemId, quantity) {
    const token = sessionStorage.getItem('access_token') || localStorage.getItem('access_token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

    try {
      const response = await axiosInstance.patch(`${BACKEND_URL}/cart/cart/${cartItemId}/`, {
        quantity
      }, { headers });
      
      dispatch(cartActions.updateCart(response.data));
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error("Network error");
    }
  }

  static async deleteCartItem(dispatch, cartItemId) {
    const token = sessionStorage.getItem('access_token') || localStorage.getItem('access_token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

    try {
      await axiosInstance.delete(`${BACKEND_URL}/cart/cart/${cartItemId}/`, { headers });
      dispatch(cartActions.deleteItem({ id: cartItemId }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response ? error.response.data : "Network error" };
    }
  }

  static async clearCart(dispatch) {
    const token = sessionStorage.getItem('access_token') || localStorage.getItem('access_token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

    try {
      const response = await axiosInstance.post(`${BACKEND_URL}/cart/cart/clear/`, {}, { headers });
      dispatch(cartActions.resetCart());
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error("Network error");
    }
  }
}
