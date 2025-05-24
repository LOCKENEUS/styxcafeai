import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = import.meta.env.VITE_API_URL;

// Async thunk to create a sales package
export const createShipment = createAsyncThunk(
  'saShipment/createShipment',
  async (shipmentData, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/superadmin/inventory/so/shipment`, 
        shipmentData,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
          },
        }
      );
      toast.success('Shipment added successfully!');
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Async thunk to get a purchase receive by ID
export const getShipmentList = createAsyncThunk(
  'saShipment/getShipmentList',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/superadmin/inventory/so/shipment/list`,
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

export const getShipmentDetails = createAsyncThunk(
  'saShipment/getShipmetDetails',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/superadmin/inventory/so/shipment/${id}`,
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

const saShipmentSlice = createSlice({
  name: 'shipment',
  initialState: {
    shipmentList: [],       
    selectedItem: null,           
    loading: false,
    error: null,
  },
  reducers: {
    setShipmentItem: (state, action) => {
      state.selectedItem = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createShipment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createShipment.fulfilled, (state, action) => {
        state.loading = false;
        state.shipmentList.push(action.payload); // Append new item
      })
      .addCase(createShipment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get List
      .addCase(getShipmentList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getShipmentList.fulfilled, (state, action) => {
        state.loading = false;
        state.shipmentList = action.payload; 
      })
      .addCase(getShipmentList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // get shipment by id 
      .addCase(getShipmentDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getShipmentDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedItem = action.payload; 
      })
      .addCase(getShipmentDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { setShipmentItem } = saShipmentSlice.actions;
export default saShipmentSlice.reducer;