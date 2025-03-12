import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = import.meta.env.VITE_API_URL;

// Fetch all vendors
export const getVendors = createAsyncThunk(
  'vendors/getVendors',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/inventory/vendor/list/${id}`);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Fetch a single vendor by ID
export const getVendorById = createAsyncThunk(
  'vendors/getVendorById',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/inventory/vendor/${id}`);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Add a new vendor
export const addVendor = createAsyncThunk(
  'vendors/addVendor',
  async (vendorData, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/admin/inventory/vendor`, vendorData);
      toast.success('Vendor added successfully!');
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Update a vendor
export const updateVendor = createAsyncThunk(
  'vendors/updateVendor',
  async ({ id, vendorData }, thunkAPI) => {
    try {
      const response = await axios.put(`${BASE_URL}/admin/inventory/vendor/${id}`, vendorData);
      toast.success('Vendor updated successfully!');
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Delete a vendor
export const deleteVendor = createAsyncThunk(
  'vendors/deleteVendor',
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${BASE_URL}/admin/inventory/vendor/${id}`);
      toast.success('Vendor deleted successfully!');
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

const vendorsSlice = createSlice({
  name: 'vendors',
  initialState: {
    vendors: [],
    selectedVendor: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedVendor: (state, action) => {
      state.selectedVendor = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all vendors
      .addCase(getVendors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getVendors.fulfilled, (state, action) => {
        state.loading = false;
        state.vendors = action.payload;
      })
      .addCase(getVendors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get vendor by ID
      .addCase(getVendorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getVendorById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedVendor = action.payload;
      })
      .addCase(getVendorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add vendor
      .addCase(addVendor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addVendor.fulfilled, (state, action) => {
        state.loading = false;
        state.vendors.push(action.payload);
      })
      .addCase(addVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete vendor
      .addCase(deleteVendor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVendor.fulfilled, (state, action) => {
        state.loading = false;
        state.vendors = state.vendors.filter((vendor) => vendor._id !== action.payload);
      })
      .addCase(deleteVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update vendor
      .addCase(updateVendor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVendor.fulfilled, (state, action) => {
        state.loading = false;
        const updatedVendor = action.payload;
        // Find the vendor in the array and update it
        const index = state.vendors.findIndex(vendor => vendor._id === updatedVendor._id);
        if (index !== -1) {
          state.vendors[index] = updatedVendor;
        }
        // Also update selectedVendor if it's the same vendor
        if (state.selectedVendor && state.selectedVendor._id === updatedVendor._id) {
          state.selectedVendor = updatedVendor;
        }
      })
      .addCase(updateVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedVendor } = vendorsSlice.actions;
export default vendorsSlice.reducer;
