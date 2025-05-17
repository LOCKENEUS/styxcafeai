import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = import.meta.env.VITE_API_URL;

// Fetch all Purchase Bills
export const getPurchaseBills = createAsyncThunk(
  'purchaseBill/getPurchaseBills',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/superadmin/inventory/po/bill/list`,
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

// Fetch a single Purchase Bill by ID
export const getPurchaseBillById = createAsyncThunk(
  'purchaseBill/getPurchaseBillById',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/superadmin/inventory/po/${id}`,
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

// Add a new Purchase Bill
export const addPurchaseBill = createAsyncThunk(
  'purchaseBill/addPurchaseBill',
  async (billData, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/superadmin/inventory/po/bill`, 
        billData,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
          },
        }
      );
      toast.success('Purchase Bill added successfully!');
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Update a Purchase Bill
export const updatePurchaseBill = createAsyncThunk(
  'purchaseBill/updatePurchaseBill',
  async ({ id, billData }, thunkAPI) => {
    try {
      const response = await axios.put(`${BASE_URL}/superadmin/inventory/po/bill/${id}`, 
        billData,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
          },
        }
      );
      toast.success('Purchase Bill updated successfully!');
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Delete a Purchase Bill
export const deletePurchaseBill = createAsyncThunk(
  'purchaseBill/deletePurchaseBill',
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${BASE_URL}/superadmin/inventory/po/bill/${id}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
          },
        }
      );
      toast.success('Purchase Bill deleted successfully!');
      return id;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

const purchaseBillSlice = createSlice({
  name: 'purchaseBill',
  initialState: {
    bills: [],
    payments: [],
    selectedBill: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedBill: (state, action) => {
      state.selectedBill = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all Purchase Bills
      .addCase(getPurchaseBills.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPurchaseBills.fulfilled, (state, action) => {
        state.loading = false;
        state.bills = action.payload;
      })
      .addCase(getPurchaseBills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Purchase Bill by ID
      .addCase(getPurchaseBillById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPurchaseBillById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBill = action.payload;
      })
      .addCase(getPurchaseBillById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Purchase Bill
      .addCase(addPurchaseBill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPurchaseBill.fulfilled, (state, action) => {
        state.loading = false;
        state.bills.push(action.payload);
      })
      .addCase(addPurchaseBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Purchase Bill
      .addCase(deletePurchaseBill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePurchaseBill.fulfilled, (state, action) => {
        state.loading = false;
        state.bills = state.bills.filter((bill) => bill._id !== action.payload);
      })
      .addCase(deletePurchaseBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Purchase Bill
      .addCase(updatePurchaseBill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePurchaseBill.fulfilled, (state, action) => {
        state.loading = false;
        const updatedBill = action.payload;
        const index = state.bills.findIndex(bill => bill._id === updatedBill._id);
        if (index !== -1) {
          state.bills[index] = updatedBill;
        }
        if (state.selectedBill && state.selectedBill._id === updatedBill._id) {
          state.selectedBill = updatedBill;
        }
      })
      .addCase(updatePurchaseBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedBill } = purchaseBillSlice.actions;
export default purchaseBillSlice.reducer;
