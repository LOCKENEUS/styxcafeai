import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = import.meta.env.VITE_API_URL;

// Async thunk
export const createPurchaseReceive = createAsyncThunk(
  'purchaseOrder/createPurchaseReceive',
  async (POData, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/admin/inventory/po/receive`, POData);
      toast.success('Purchase Receive added successfully!');
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Slice
const purchaseReceiveSlice = createSlice({
  name: 'purchaseReceive',
  initialState: {
    purchaseReceive: [],
    selectedItem: null,
    loading: false,
    error: null,
  },
  reducers: {
    setPurchaseReceiveItem: (state, action) => {
      state.selectedItem = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPurchaseReceive.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPurchaseReceive.fulfilled, (state, action) => {
        state.loading = false;
        state.purchaseReceive.push(action.payload);
      })
      .addCase(createPurchaseReceive.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { setPurchaseReceiveItem } = purchaseReceiveSlice.actions;
export default purchaseReceiveSlice.reducer;
