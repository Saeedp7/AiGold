import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../components/utils/axiosinterceptor';

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async () => {
    const response = await axiosInstance.get('/shop/categories/');
    return response.data;
  }
);
