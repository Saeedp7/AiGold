import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BACKEND_URL } from '../../components/utils/api';

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async () => {
    const response = await axios.get(`${BACKEND_URL}/shop/categories/`);
    return response.data;
  }
);
