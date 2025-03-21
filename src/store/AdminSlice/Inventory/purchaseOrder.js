import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = import.meta.env.VITE_API_URL;




export const CreateVendor = createAsyncThunk(
  'purchaseOrder/createVendor', 
  async (vendorData, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/admin/inventory/vendor`, vendorData);
      toast.success('Vendor added successfully!');
      return response.data.data;
    } catch (error) {
      let errorMessage = error.response?.data?.message || 'Something went wrong';
      toast.error(errorMessage); // Show error toast for CreateVendor

      // Check if the error is a duplicate email
      if (errorMessage.includes('E11000 duplicate key error') && errorMessage.includes('email')) {
        errorMessage = 'Email already exists!';
      }

      toast.error(errorMessage); // Show error toast
      return thunkAPI.rejectWithValue(errorMessage); 
    }
  }
);
export const GetVendorsList = createAsyncThunk(
  'purchaseOrder/getVendorsList',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/inventory/vendor/list/${id}`);
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong'); // Show error toast for GetVendorsList
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);
const OPSlice = createSlice({
  name: 'purchaseOrder',
  initialState: {
    purchaseOrder: [], 
    selectedItem: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedItem: (state, action) => {
      state.selectedItem = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
    // Get all vendors
          .addCase(GetVendorsList.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(GetVendorsList.fulfilled, (state, action) => {
            state.loading = false;
            state.vendors = action.payload;
          })
          .addCase(GetVendorsList.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          })
    // Create vendor
      .addCase(CreateVendor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(CreateVendor.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedItem = action.payload; 
      })
      .addCase(CreateVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedItem } = OPSlice.actions;
export default OPSlice.reducer;
