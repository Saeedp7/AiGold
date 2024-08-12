import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { BACKEND_URL } from '../../components/utils/api';

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async () => {
    const response = await axios.get(`${BACKEND_URL}/shop/categories/`);
    return response.data;
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default categorySlice.reducer;
