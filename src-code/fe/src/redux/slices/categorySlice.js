import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderService from '../../services/orderService';

const initialState = {
  categories: [],
  loading: false,
  error: null,
};

// Async thunk: Lấy tất cả category kèm products
export const fetchCategories = createAsyncThunk(
  'category/fetchCategories',
  async () => {
    const response = await orderService.fetchCatagory(); // response = [{ category_id, name, products: [...] }, ...]
    return response;
  }
);

// Async thunk: Lấy chi tiết 1 category (nếu cần)
export const fetchCategoryById = createAsyncThunk(
  'category/fetchCategoryById',
  async (category_id) => {
    const response = await orderService.fetchCategoryById(category_id);
    return response;
  }
);

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch by ID
      .addCase(fetchCategoryById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        // Optional: bạn có thể thêm category vào danh sách nếu muốn
        state.error = null;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default categorySlice.reducer;
