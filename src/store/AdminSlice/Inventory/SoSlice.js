import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = import.meta.env.VITE_API_URL;

// Fetch all SOs
export const getSOs = createAsyncThunk(
  'so/getSOs',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/inventory/so/list/${id}`);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Fetch a single SO by ID
export const getSOById = createAsyncThunk(
  'so/getSOById',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/inventory/so/${id}`);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Add a new SO
export const addSO = createAsyncThunk(
  'so/addSO',
  async (soData, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/admin/inventory/so`, soData);
      toast.success('Sales Order added successfully!');
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Update a SO
export const updateSO = createAsyncThunk(
  'so/updateSO',
  async ({ id, soData }, thunkAPI) => {
    try {
      const response = await axios.put(`${BASE_URL}/admin/inventory/so/${id}`, soData);
      toast.success('Sales Order updated successfully!');
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Delete a SO
export const deleteSO = createAsyncThunk(
  'so/deleteSO',
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${BASE_URL}/admin/inventory/so/${id}`);
      toast.success('Sales Order deleted successfully!');
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

const soSlice = createSlice({
  name: 'so',
  initialState: {
    salesOrders: [],
    selectedSO: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedSO: (state, action) => {
      state.selectedSO = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all SOs
      .addCase(getSOs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSOs.fulfilled, (state, action) => {
        state.loading = false;
        state.salesOrders = action.payload;
      })
      .addCase(getSOs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get SO by ID
      .addCase(getSOById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSOById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSO = action.payload;
      })
      .addCase(getSOById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add SO
      .addCase(addSO.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSO.fulfilled, (state, action) => {
        state.loading = false;
        state.salesOrders.push(action.payload);
      })
      .addCase(addSO.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete SO
      .addCase(deleteSO.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSO.fulfilled, (state, action) => {
        state.loading = false;
        state.salesOrders = state.salesOrders.filter((so) => so._id !== action.payload);
      })
      .addCase(deleteSO.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update SO
      .addCase(updateSO.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSO.fulfilled, (state, action) => {
        state.loading = false;
        const updatedSO = action.payload;
        const index = state.salesOrders.findIndex(so => so._id === updatedSO._id);
        if (index !== -1) {
          state.salesOrders[index] = updatedSO;
        }
        if (state.selectedSO && state.selectedSO._id === updatedSO._id) {
          state.selectedSO = updatedSO;
        }
      })
      .addCase(updateSO.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedSO } = soSlice.actions;
export default soSlice.reducer;
