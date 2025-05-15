import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = import.meta.env.VITE_API_URL;

// Fetch all tax fields
export const getTaxes = createAsyncThunk(
  'taxes/getTaxes',
  async (thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/superadmin/inventory/tax/list`,
      {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`,
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

// Fetch a single tax field by ID
export const getTaxById = createAsyncThunk(
  'taxes/getTaxById',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/superadmin/inventory/tax/${id}`,
      {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`,
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

// Add a new tax field
export const addTax = createAsyncThunk(
  'taxes/addTax',
  async (fieldData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/superadmin/inventory/tax`, 
        fieldData,
        {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`,
          },
        }
      );
      toast.success('Tax field added successfully!');
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Update an existing tax field
export const updateTax = createAsyncThunk(
  'taxes/updateTax',
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/superadmin/inventory/tax/${id}`, 
        data,
        {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`,
          },
        }
      
      );
      toast.success('Tax field updated successfully!');
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Delete a tax field
export const deleteTax = createAsyncThunk(
  'taxes/deleteTax',
  async (id, thunkAPI) => {
    try {
      await axios.delete(
        `${BASE_URL}/superadmin/inventory/tax/${id}`,
       {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`,
        },
      }
      );
      toast.success('Tax field deleted successfully!');
      return id;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

const taxSlice = createSlice({
  name: 'taxes',
  initialState: {
    taxes: [],
    selectedTax: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedTax: (state, action) => {
      state.selectedTax = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all tax fields
      .addCase(getTaxes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTaxes.fulfilled, (state, action) => {
        state.loading = false;
        state.taxes = action.payload;
      })
      .addCase(getTaxes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get tax field by ID
      .addCase(getTaxById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTaxById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTax = action.payload;
      })
      // Add tax field
      .addCase(addTax.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTax.fulfilled, (state, action) => {
        state.loading = false;
        state.taxes.push(action.payload);
      })
      .addCase(addTax.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update tax field
      .addCase(updateTax.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTax.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTax = action.payload;
        const index = state.taxes.findIndex((field) => field._id === updatedTax._id);
        if (index !== -1) {
          state.taxes[index] = updatedTax;
        }
      })
      .addCase(updateTax.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete tax field
      .addCase(deleteTax.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTax.fulfilled, (state, action) => {
        state.loading = false;
        state.taxes = state.taxes.filter((field) => field._id !== action.payload);
      })
      .addCase(deleteTax.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedTax } = taxSlice.actions;
export default taxSlice.reducer;