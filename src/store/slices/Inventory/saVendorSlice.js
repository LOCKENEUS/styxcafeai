import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = import.meta.env.VITE_API_URL;

// Fetch all vendors
export const getSaVendors = createAsyncThunk(
  'vendors/getSaVendors',
  async (thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/superadmin/inventory/vendor/list`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Fetch a single vendor by ID
export const getSaVendorById = createAsyncThunk(
  'vendors/getSaVendorById',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/superadmin/inventory/vendor/${id}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Add a new vendor
export const addSaVendor = createAsyncThunk(
  'vendors/addSaVendor',
  async (vendorData, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/superadmin/inventory/vendor`, 
        vendorData,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
          },
        }
      );
      toast.success('Vendor added successfully!');
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Update a vendor
export const updateSaVendor = createAsyncThunk(
  'vendors/updateSaVendor',
  async ({ id, vendorData }, thunkAPI) => {
    try {
      const response = await axios.put(`${BASE_URL}/superadmin/inventory/vendor/${id}`, 
        vendorData,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
          },
        }
      );
      toast.success('Vendor updated successfully!');
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Delete a vendor
export const deleteSaVendor = createAsyncThunk(
  'vendors/deleteSaVendor',
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${BASE_URL}/superadmin/inventory/vendor/${id}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
          },
        }
      );
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
      .addCase(getSaVendors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSaVendors.fulfilled, (state, action) => {
        state.loading = false;
        state.vendors = action.payload;
      })
      .addCase(getSaVendors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get vendor by ID
      .addCase(getSaVendorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSaVendorById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedVendor = action.payload;
      })
      .addCase(getSaVendorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add vendor
      .addCase(addSaVendor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSaVendor.fulfilled, (state, action) => {
        state.loading = false;
        state.vendors.push(action.payload);
      })
      .addCase(addSaVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete vendor
      .addCase(deleteSaVendor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSaVendor.fulfilled, (state, action) => {
        state.loading = false;
        state.vendors = state.vendors.filter((vendor) => vendor._id !== action.payload);
      })
      .addCase(deleteSaVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update vendor
      .addCase(updateSaVendor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSaVendor.fulfilled, (state, action) => {
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
      .addCase(updateSaVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedVendor } = vendorsSlice.actions;
export default vendorsSlice.reducer;
