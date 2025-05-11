import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderService from '../../services/orderService';

const initialState = {
  employee: null,
  loading: false,
  error: null,
};

// Lấy thông tin nhân viên theo iduser
export const fetchEmployeeByUser = createAsyncThunk(
  'employee/fetchEmployeeByUser',
  async (iduser, thunkAPI) => {
    try {
      const response = await orderService.fetchEmployeeByUser(iduser);
        console.log(response);
      
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Tạo nhân viên mới
export const createEmployee = createAsyncThunk(
  'employee/createEmployee',
  async (data, thunkAPI) => {
    try {
      const response = await orderService.createEmployee(data);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Cập nhật thông tin nhân viên
export const updateEmployee = createAsyncThunk(
  'employee/updateEmployee',
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await orderService.updateEmployee(id, data);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    resetEmployee: (state) => {
      state.employee = null;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployeeByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeByUser.fulfilled, (state, action) => {
        console.log(action.payload);
        
        state.employee = action.payload;
        state.loading = false;
      })
      .addCase(fetchEmployeeByUser.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(createEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.employee = action.payload;
        state.loading = false;
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(updateEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.employee = action.payload;
        state.loading = false;
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  }
});

export const { resetEmployee } = employeeSlice.actions;

export default employeeSlice.reducer;
