import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderService from '../../services/orderService';

const initialState = {
  promotions: [],
  loading: false,
  error: null,
};

export const fetchPromotions = createAsyncThunk(
  'promotion/fetchPromotions',
  async () => {
    const response = await orderService.fetchPromotions();
    return response;
  }
);

const promotionSlice = createSlice({
  name: 'promotion',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPromotions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPromotions.fulfilled, (state, action) => {
        state.loading = false;
        state.promotions = action.payload;
        state.error = null;
      })
      .addCase(fetchPromotions.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to fetch promotions';
      });
  },
});

export default promotionSlice.reducer;