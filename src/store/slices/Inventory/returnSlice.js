import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = import.meta.env.VITE_API_URL;

// Async thunk to create a sales package
export const createSalesReturn = createAsyncThunk(
  'salesReturn/createSalesReturn',
  async (salesReturnData, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/superadmin/inventory/so/return`, 
        salesReturnData,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
          },
        }
      );
      toast.success('Sales return added successfully!');
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Async thunk to get a purchase receive by ID
export const getSalesReturnList = createAsyncThunk(
  'salesReturn/getSalesReturnList',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/superadmin/inventory/so/return/list`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

export const getSalesReturnDetails = createAsyncThunk(
  'salesReturn/getSalesReturnDetails',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/superadmin/inventory/so/return/${id}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

const salesReturnSlice = createSlice({
  name: 'salesReturn',
  initialState: {
    salesReturnList: [],       
    selectedItem: null,           
    loading: false,
    error: null,
  },
  reducers: {
    setSalesReturnItem: (state, action) => {
      state.selectedItem = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createSalesReturn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSalesReturn.fulfilled, (state, action) => {
        state.loading = false;
        state.salesReturnList.push(action.payload); // Append new item
      })
      .addCase(createSalesReturn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get List
      .addCase(getSalesReturnList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSalesReturnList.fulfilled, (state, action) => {
        state.loading = false;
        state.salesReturnList = action.payload; 
      })
      .addCase(getSalesReturnList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // get salesReturn by id 
      .addCase(getSalesReturnDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSalesReturnDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedItem = action.payload; 
      })
      .addCase(getSalesReturnDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { setSalesReturnItem } = salesReturnSlice.actions;
export default salesReturnSlice.reducer;