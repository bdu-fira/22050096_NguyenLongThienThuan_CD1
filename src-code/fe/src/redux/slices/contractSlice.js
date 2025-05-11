import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import contractService from '../../services/contractService';

const initialState = {
  contracts: [],
  currentContract: null,
  loading: false,
  error: null,
};

export const createContract = createAsyncThunk(
  'contract/createContract',
  async (data, { rejectWithValue }) => {
    try {
      const response = await contractService.createContract(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchContracts = createAsyncThunk(
  'contract/fetchContracts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await contractService.fetchContracts();
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchContractById = createAsyncThunk(
  'contract/fetchContractById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await contractService.fetchContractById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const contractSlice = createSlice({
  name: 'contract',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createContract.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createContract.fulfilled, (state, action) => {
        state.loading = false;
        state.contracts = [...state.contracts, action.payload];
      })
      .addCase(createContract.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchContracts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContracts.fulfilled, (state, action) => {
        state.loading = false;
        state.contracts = action.payload;
      })
      .addCase(fetchContracts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchContractById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContractById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentContract = action.payload;
      })
      .addCase(fetchContractById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default contractSlice.reducer;