import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = import.meta.env.VITE_API_URL;

// Fetch all tax fields
export const getTaxFields = createAsyncThunk(
  'taxFields/getTaxFields',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/inventory/tax/list/${id}`);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Fetch a single tax field by ID
export const getTaxFieldById = createAsyncThunk(
  'taxFields/getTaxFieldById',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/inventory/tax/${id}`);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Add a new tax field
export const addTaxField = createAsyncThunk(
  'taxFields/addTaxField',
  async (fieldData, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/admin/inventory/tax`, fieldData);
      toast.success('Tax field added successfully!');
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Update an existing tax field
export const updateTaxField = createAsyncThunk(
  'taxFields/updateTaxField',
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await axios.put(`${BASE_URL}/admin/inventory/tax/${id}`, data);
      toast.success('Tax field updated successfully!');
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Delete a tax field
export const deleteTaxField = createAsyncThunk(
  'taxFields/deleteTaxField',
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${BASE_URL}/admin/inventory/tax/${id}`);
      toast.success('Tax field deleted successfully!');
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

const taxFieldSlice = createSlice({
  name: 'taxFields',
  initialState: {
    taxFields: [],
    selectedTaxField: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedTaxField: (state, action) => {
      state.selectedTaxField = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all tax fields
      .addCase(getTaxFields.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTaxFields.fulfilled, (state, action) => {
        state.loading = false;
        state.taxFields = action.payload;
      })
      .addCase(getTaxFields.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get tax field by ID
      .addCase(getTaxFieldById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTaxFieldById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTaxField = action.payload;
      })
      // Add tax field
      .addCase(addTaxField.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTaxField.fulfilled, (state, action) => {
        state.loading = false;
        state.taxFields.push(action.payload);
      })
      .addCase(addTaxField.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update tax field
      .addCase(updateTaxField.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTaxField.fulfilled, (state, action) => {
        state.loading = false;
        const updatedField = action.payload;
        const index = state.taxFields.findIndex((field) => field._id === updatedField._id);
        if (index !== -1) {
          state.taxFields[index] = updatedField;
        }
      })
      .addCase(updateTaxField.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete tax field
      .addCase(deleteTaxField.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTaxField.fulfilled, (state, action) => {
        state.loading = false;
        state.taxFields = state.taxFields.filter((field) => field._id !== action.payload);
      })
      .addCase(deleteTaxField.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedTaxField } = taxFieldSlice.actions;
export default taxFieldSlice.reducer;
