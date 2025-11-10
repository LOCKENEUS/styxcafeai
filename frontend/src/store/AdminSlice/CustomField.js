import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = import.meta.env.VITE_API_URL;

// Fetch all custom fields
export const getCustomFields = createAsyncThunk(
  'customFields/getCustomFields',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/inventory/custom-field/list/${id}`);
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Fetch a single custom field by ID
export const getCustomFieldById = createAsyncThunk(
  'customFields/getCustomFieldById',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/inventory/custom-field/${id}`);
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Add a new custom field
export const addCustomField = createAsyncThunk(
  'customFields/addCustomField',
  async (fieldData, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/admin/inventory/custom-field`, fieldData);
      toast.success('Custom field added successfully!');
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Update an existing custom field
export const updateCustomField = createAsyncThunk(
  'customFields/updateCustomField',
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await axios.put(`${BASE_URL}/admin/inventory/custom-field/${id}`, data);
      toast.success('Custom field updated successfully!');
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Delete a custom field
export const deleteCustomField = createAsyncThunk(
  'customFields/deleteCustomField',
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${BASE_URL}/admin/inventory/custom-field/${id}`);
      toast.success('Custom field deleted successfully!');
      return id;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

const customFieldSlice = createSlice({
  name: 'customFields',
  initialState: {
    customFields: [],
    selectedCustomField: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedCustomField: (state, action) => {
      state.selectedCustomField = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all custom fields
      .addCase(getCustomFields.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCustomFields.fulfilled, (state, action) => {
        state.loading = false;
        state.customFields = action.payload;
      })
      .addCase(getCustomFields.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get custom field by ID
      .addCase(getCustomFieldById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCustomFieldById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCustomField = action.payload;
      })
      // Add custom field
      .addCase(addCustomField.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCustomField.fulfilled, (state, action) => {
        state.loading = false;
        state.customFields.push(action.payload);
      })
      .addCase(addCustomField.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update custom field
      .addCase(updateCustomField.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCustomField.fulfilled, (state, action) => {
        state.loading = false;
        const updatedField = action.payload;
        const index = state.customFields.findIndex((field) => field._id === updatedField._id);
        if (index !== -1) {
          state.customFields[index] = updatedField;
        }
      })
      .addCase(updateCustomField.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete custom field
      .addCase(deleteCustomField.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCustomField.fulfilled, (state, action) => {
        state.loading = false;
        state.customFields = state.customFields.filter((field) => field._id !== action.payload);
      })
      .addCase(deleteCustomField.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedCustomField } = customFieldSlice.actions;
export default customFieldSlice.reducer;
