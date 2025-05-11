import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import  authService from '../../services/authService';
import { message } from 'antd';

const initialState = {
  roles: [],
  loading: false,
  error: null,
};

export const fetchRoles = createAsyncThunk(
  'role/fetchRoles',
  async (_, thunkAPI) => {
    try {
      const response = await authService.fetchRoles();
      return response;
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      message.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const assignRoleToUser = createAsyncThunk(
  'role/assignRoleToUser',
  async (data, thunkAPI) => {
    try {
      const response = await authService.assignRoleToUser(data);
      message.success(response);
      return response;
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      message.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const removeRoleFromUser = createAsyncThunk(
  'role/removeRoleFromUser',
  async ({ iduser, idRole }, thunkAPI) => {
    try {
      const response = await authService.removeRoleFromUser(iduser, idRole);
      message.success(response);
      return response;
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      message.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(assignRoleToUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(assignRoleToUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(assignRoleToUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeRoleFromUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeRoleFromUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(removeRoleFromUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default roleSlice.reducer;
