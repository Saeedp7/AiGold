import axiosInstance from './axiosinterceptor';
import { cartActions } from '../../store/reducers/cartReducer';


export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default class ApiService {
  static setAuthToken() {
    // Authorization header is handled by the interceptor
  }

  static async getCart() {
    try {
      const response = await axiosInstance.get('/cart/cart/');      
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Network error');
    }
  }

  static async addToCart(dispatch, product_id, quantity) {
    try {
      const response = await axiosInstance.post('/cart/cart/', {
        product_id,
        quantity,
      });
      
      dispatch(cartActions.addToCart(response.data));
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        return { error: error.response.data.error };
      } else {
        return { error: 'Network error' };
      }
    }
  }

  static async updateCartItem(dispatch, cartItemId, quantity) {
    try {
      const response = await axiosInstance.patch(`/cart/cart/${cartItemId}/`, {
        quantity,
      });
      
      dispatch(cartActions.updateCart(response.data));
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Network error');
    }
  }

  static async deleteCartItem(dispatch, cartItemId) {
    try {
      await axiosInstance.delete(`/cart/cart/${cartItemId}/`);
      dispatch(cartActions.deleteItem({ id: cartItemId }));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response ? error.response.data : 'Network error',
      };
    }
  }

  static async clearCart(dispatch) {
    try {
      const response = await axiosInstance.post('/cart/cart/clear/', {});
      dispatch(cartActions.resetCart());
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Network error');
    }
  }
}
