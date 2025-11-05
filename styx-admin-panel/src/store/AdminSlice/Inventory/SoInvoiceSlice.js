import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = import.meta.env.VITE_API_URL;

// Fetch all SO Invoices
export const getSOInvoices = createAsyncThunk(
  'soInvoice/getSOInvoices',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/inventory/so/invoice/list/${id}`);
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Fetch a single SO Invoice by ID
export const getSOInvoiceById = createAsyncThunk(
  'soInvoice/getSOInvoiceById',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/inventory/so/invoice/${id}`);
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Add a new SO Invoice
export const addSOInvoice = createAsyncThunk(
  'soInvoice/addSOInvoice',
  async (invoiceData, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/admin/inventory/so/invoice`, invoiceData);
      toast.success('Sales Order Invoice added successfully!');
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Update a SO Invoice
export const updateSOInvoice = createAsyncThunk(
  'soInvoice/updateSOInvoice',
  async ({ id, invoiceData }, thunkAPI) => {
    try {
      const response = await axios.put(`${BASE_URL}/admin/inventory/so/invoice/${id}`, invoiceData);
      toast.success('Sales Order Invoice updated successfully!');
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Delete a SO Invoice
export const deleteSOInvoice = createAsyncThunk(
  'soInvoice/deleteSOInvoice',
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${BASE_URL}/admin/inventory/so/invoice/${id}`);
      toast.success('Sales Order Invoice deleted successfully!');
      return id;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

const soInvoiceSlice = createSlice({
  name: 'soInvoice',
  initialState: {
    invoices: [],
    selectedInvoice: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedInvoice: (state, action) => {
      state.selectedInvoice = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all SO Invoices
      .addCase(getSOInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSOInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload;
      })
      .addCase(getSOInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get SO Invoice by ID
      .addCase(getSOInvoiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSOInvoiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedInvoice = action.payload;
      })
      .addCase(getSOInvoiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add SO Invoice
      .addCase(addSOInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSOInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices.push(action.payload);
      })
      .addCase(addSOInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete SO Invoice
      .addCase(deleteSOInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSOInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = state.invoices.filter((invoice) => invoice._id !== action.payload);
      })
      .addCase(deleteSOInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update SO Invoice
      .addCase(updateSOInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSOInvoice.fulfilled, (state, action) => {
        state.loading = false;
        const updatedInvoice = action.payload;
        const index = state.invoices.findIndex(invoice => invoice._id === updatedInvoice._id);
        if (index !== -1) {
          state.invoices[index] = updatedInvoice;
        }
        if (state.selectedInvoice && state.selectedInvoice._id === updatedInvoice._id) {
          state.selectedInvoice = updatedInvoice;
        }
      })
      .addCase(updateSOInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedInvoice } = soInvoiceSlice.actions;
export default soInvoiceSlice.reducer;
