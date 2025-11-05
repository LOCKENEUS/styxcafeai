import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = import.meta.env.VITE_API_URL;

// Add payment
export const addPayment = createAsyncThunk(
  'payment/addPayment',
  async (paymentData, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/admin/inventory/so/invoice/payment`, paymentData);
      toast.success('Payment collected successfully!');
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Get payments list
export const getPayments = createAsyncThunk(
  'payment/getPayments',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/inventory/so/invoice/payment/list/${id}`);
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Get single payment
export const getPaymentById = createAsyncThunk(
  'payment/getPaymentById',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/inventory/so/invoice/payment/invoice-payments/${id}`);
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

const collectPaymentSlice = createSlice({
  name: 'payment',
  initialState: {
    payments: [],
    selectedPayment: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedPayment: (state, action) => {
      state.selectedPayment = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add payment
      .addCase(addPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.payments.push(action.payload);
      })
      .addCase(addPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get all payments
      .addCase(getPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload;
      })
      .addCase(getPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get payment by ID
      .addCase(getPaymentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPaymentById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPayment = action.payload;
      })
      .addCase(getPaymentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedPayment } = collectPaymentSlice.actions;
export default collectPaymentSlice.reducer;
