import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = import.meta.env.VITE_API_URL;

// Fetch all customers
export const getCustomers = createAsyncThunk(
  'customers/getCustomers',
  async (id, thunkAPI) => {
    try {
      console.log('Making API call with cafe ID:', id);
      const response = await axios.get(`${BASE_URL}/admin/customer/list/${id}`);
      console.log('API response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('API error:', error);
      toast.error('Error fetching customers: ' + (error.response?.data?.message || 'Something went wrong'));
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

export const searchCustomers = createAsyncThunk(
  'customers/searchCustomers',
  async ({cafeId, searchTerm}, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/customer/search/${cafeId}?search=${searchTerm}`);
      console.log('API response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('API error:', error);
      toast.error('Error fetching customers: ' + (error.response?.data?.message || 'Something went wrong'));
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Fetch a single customer by ID
export const getCustomerById = createAsyncThunk(
  'customers/getCustomerById',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/customer/${id}`);
      return response.data;
    } catch (error) {
      toast.error('Error fetching customer by ID: ' + (error.response?.data?.message || 'Something went wrong'));
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Add a new customer
export const addCustomer = createAsyncThunk(
  'customers/addCustomer',
  async (customerData, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/admin/customer`, customerData);
      toast.success('Customer added successfully!');
      return response.data.data;
    } catch (error) {
      toast.error('Error adding customer: ' + (error.response?.data?.message || 'Something went wrong'));
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Update an existing customer
export const updateCustomer = createAsyncThunk(
  'customers/updateCustomer',
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await axios.put(`${BASE_URL}/admin/customer/${id}`, data);
      toast.success('Customer updated successfully!');
      return response.data.data;
    } catch (error) {
      toast.error('Error updating customer: ' + (error.response?.data?.message || 'Something went wrong'));
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Delete a customer
export const deleteCustomer = createAsyncThunk(
  'customers/deleteCustomer',
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${BASE_URL}/admin/customer/${id}`);
      toast.success('Customer deleted successfully!');
      return id;
    } catch (error) {
      toast.error('Error deleting customer: ' + (error.response?.data?.message || 'Something went wrong'));
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

const customerSlice = createSlice({
  name: 'customers',
  initialState: {
    customers: [],
    selectedCustomer: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedCustomer: (state, action) => {
      state.selectedCustomer = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all customers
      .addCase(getCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload;
      })
      .addCase(getCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch customer by ID
      .addCase(getCustomerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCustomerById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCustomer = action.payload;
        console.log(state.selectedCustomer);
      })
      .addCase(getCustomerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Customer
      .addCase(addCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers.push(action.payload);
      })
      .addCase(addCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Customer
      .addCase(updateCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.loading = false;
        const updatedCustomer = action.payload;
        const index = state.customers.findIndex((customer) => customer._id === updatedCustomer._id);
        if (index !== -1) {
          state.customers[index] = updatedCustomer;
        }
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Customer
      .addCase(deleteCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = state.customers.filter((customer) => customer._id !== action.payload);
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedCustomer } = customerSlice.actions;
export default customerSlice.reducer;
