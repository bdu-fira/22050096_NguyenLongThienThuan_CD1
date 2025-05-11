import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderService from '../../services/orderService';

const initialState = {
  customer: null,
  loading: false,
  error: null,
};

export const fetchCustomerByUser = createAsyncThunk(
  'customer/fetchCustomerByUser',
  async (iduser, thunkAPI) => {
    try {
      const response = await orderService.fetchCustomerByUser(iduser);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const createCustomer = createAsyncThunk(
  'customer/createCustomer',
  async (data, thunkAPI) => {
    try {
      const response = await orderService.createCustomer(data);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateCustomer = createAsyncThunk(
  'customer/updateCustomer',
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await orderService.updateCustomer(id, data);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    fetchCustomerSuccess: (state, action) => {
      state.customer = action.payload;
      state.loading = false;
      state.error = null;
    },
    createCustomerSuccess: (state, action) => {
      state.customer = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateCustomerSuccess: (state, action) => {
      state.customer = action.payload;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerByUser.fulfilled, (state, action) => {
        state.customer = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchCustomerByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.customer = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.customer = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { fetchCustomerSuccess, createCustomerSuccess, updateCustomerSuccess } = customerSlice.actions;

export default customerSlice.reducer;