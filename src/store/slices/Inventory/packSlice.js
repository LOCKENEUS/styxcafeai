import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = import.meta.env.VITE_API_URL;

// Async thunk to create a package
export const createPackage = createAsyncThunk(
  'saPackage/createPackage',
  async (POData, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/superadmin/inventory/so/package`, 
        POData,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
          },
        }
      );
      toast.success('Package added successfully!');
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Async thunk to get a package by ID
export const getPackageDetails = createAsyncThunk(
  'saPackage/getPackageDetails',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/superadmin/inventory/so/package/${id}`,
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

export const getPackageList = createAsyncThunk(
  'saPackage/getPackageList',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/superadmin/inventory/so/package/list`,
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

const saPackageSlice = createSlice({
  name: 'package',
  initialState: {
    packageList: [],       
    selectedPackage: null,           
    loading: false,
    error: null,
  },
  reducers: {
    setPackageItem: (state, action) => {
      state.selectedItem = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createPackage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPackage.fulfilled, (state, action) => {
        state.loading = false;
        state.packageList.push(action.payload); // Append new item
      })
      .addCase(createPackage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get by ID
      .addCase(getPackageDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPackageDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPackage = action.payload; 
      })
      .addCase(getPackageDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // get Packge list
      .addCase(getPackageList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPackageList.fulfilled, (state, action) => {
        state.loading = false;
        state.packageList = action.payload; 
      })
      .addCase(getPackageList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { setPackageItem } = saPackageSlice.actions;
export default saPackageSlice.reducer;