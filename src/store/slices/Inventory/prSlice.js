import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = import.meta.env.VITE_API_URL;

// Async thunk to create a purchase receive
export const createSaPurchaseReceive = createAsyncThunk(
  'saPurchaseReceive/createSaPurchaseReceive',
  async (POData, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/superadmin/inventory/po/receive`, 
        POData,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
          },
        }
      );
      toast.success('Purchase Receive added successfully!');
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Async thunk to get a purchase receive by ID
export const getSaPurchaseReceive = createAsyncThunk(
  'saPurchaseReceive/getSaPurchaseReceive',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/superadmin/inventory/po/receive/${id}`,
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

export const getSaPurchaseReceiveList = createAsyncThunk(
  'saPurchaseReceive/getSaPurchaseReceiveList',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/superadmin/inventory/po/receive/list`,
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

const saPurchaseReceiveSlice = createSlice({
  name: 'purchaseReceive',
  initialState: {
    purchaseReceiveList: [],       
    selectedItem: null,           
    loading: false,
    error: null,
  },
  reducers: {
    setPurchaseReceiveItem: (state, action) => {
      state.selectedItem = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createSaPurchaseReceive.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSaPurchaseReceive.fulfilled, (state, action) => {
        state.loading = false;
        state.purchaseReceiveList.push(action.payload); // Append new item
      })
      .addCase(createSaPurchaseReceive.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get by ID
      .addCase(getSaPurchaseReceive.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSaPurchaseReceive.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedItem = action.payload; 
      })
      .addCase(getSaPurchaseReceive.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // getPurchaseReceiveList
      .addCase(getSaPurchaseReceiveList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSaPurchaseReceiveList.fulfilled, (state, action) => {
        state.loading = false;
        state.purchaseReceiveList = action.payload; 
      })
      .addCase(getSaPurchaseReceiveList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { setPurchaseReceiveItem } = saPurchaseReceiveSlice.actions;
export default saPurchaseReceiveSlice.reducer;