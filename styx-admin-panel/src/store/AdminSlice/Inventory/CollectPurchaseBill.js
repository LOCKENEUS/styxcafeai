import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = import.meta.env.VITE_API_URL;

// Add purchase bill payment
export const addPurchaseBillPayment = createAsyncThunk(
  'purchaseBill/addPayment',
  async (paymentData, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/admin/inventory/po/bill/payment`, paymentData);
      toast.success('Payment collected successfully!');
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Get purchase bill payments list
export const getPurchaseBillPayments = createAsyncThunk(
  'purchaseBill/getPayments',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/inventory/po/bill/payment/list/${id}`);
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Get single purchase bill payment
export const getPurchaseBillPaymentById = createAsyncThunk(
  'purchaseBill/getPaymentById',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/inventory/po/bill/payment/bill-payments/${id}`);
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

const collectPurchaseBillSlice = createSlice({
  name: 'purchaseBill',
  initialState: {
    payments: [],
    selectedPayment: [],
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
      .addCase(addPurchaseBillPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPurchaseBillPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.payments.push(action.payload);
      })
      .addCase(addPurchaseBillPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get all payments
      .addCase(getPurchaseBillPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPurchaseBillPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload;
      })
      .addCase(getPurchaseBillPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get payment by ID
      .addCase(getPurchaseBillPaymentById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedPayment = null;
      })
      .addCase(getPurchaseBillPaymentById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPayment = action.payload;
      })
      .addCase(getPurchaseBillPaymentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.selectedPayment = null;
      });
  },
});

export const { setSelectedPayment } = collectPurchaseBillSlice.actions;
export default collectPurchaseBillSlice.reducer;
