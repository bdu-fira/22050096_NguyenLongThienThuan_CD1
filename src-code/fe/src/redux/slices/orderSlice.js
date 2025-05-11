import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderService from '../../services/orderService';
import { message } from 'antd';

const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (data, { rejectWithValue }) => {
    try {
      const response = await orderService.createOrder(data);
      message.success('Order created successfully!');
      return response;
    } catch (error) {
      message.error('Failed to create order.');
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchCustomerOrders = createAsyncThunk(
  'order/fetchCustomerOrders',
  async (id, { rejectWithValue }) => {
    try {
      const response = await orderService.fetchCustomerOrders(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'order/fetchOrderById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await orderService.fetchOrderById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchEmployeeOrders = createAsyncThunk(
  'order/fetchEmployeeOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orderService.fetchEmployeeOrders();
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'order/updateOrderStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await orderService.updateOrderStatus(id, status);
      message.success('Order status updated successfully!');
      return response;
    } catch (error) {
      message.error('Failed to update order status.');
      return rejectWithValue(error.response.data);
    }
  }
);
export const updateOrder = createAsyncThunk(
  'order/updateOrder',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await orderService.updateOrder(id, data);
      message.success('Cập nhật đơn hàng thành công!');
      return response;
    } catch (error) {
      message.error('Cập nhật đơn hàng thất bại.');
      return rejectWithValue(error.response?.data || 'Update failed');
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCustomerOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchCustomerOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchEmployeeOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchEmployeeOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;

        if (state.currentOrder && state.currentOrder.order_id === action.payload.order_id) {
          state.currentOrder.order_status = action.payload.order_status;
        }

        state.orders = state.orders.map(order =>
          order.order_id === action.payload.order_id ? action.payload : order
        );
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.loading = false;
      
        // Cập nhật currentOrder nếu trùng
        if (state.currentOrder?.order_id === action.payload.order_id) {
          state.currentOrder = action.payload;
        }
      
        // Cập nhật trong danh sách đơn hàng
        state.orders = state.orders.map(order =>
          order.order_id === action.payload.order_id ? action.payload : order
        );
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;