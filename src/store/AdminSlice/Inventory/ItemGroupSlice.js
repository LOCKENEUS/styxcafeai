import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = import.meta.env.VITE_API_URL;

// Fetch all item groups
export const getItemGroups = createAsyncThunk(
  'itemGroups/getItemGroups',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/inventory/item-group/list/${id}`,
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

// Fetch a single item group by ID
export const getItemGroupById = createAsyncThunk(
  'itemGroups/getItemGroupById',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/inventory/item-group/${id}`,
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

// Add a new item group
export const addItemGroup = createAsyncThunk(
  'itemGroups/addItemGroup',
  async (itemGroupData, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/admin/inventory/item-group`, 
        itemGroupData,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
          },
        }
      );
      toast.success('Item group added successfully!');
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Update an item group
export const updateItemGroup = createAsyncThunk(
  'itemGroups/updateItemGroup',
  async ({ id, itemGroupData }, thunkAPI) => {
    try {
      const response = await axios.put(`${BASE_URL}/admin/inventory/item-group/${id}`, 
        itemGroupData,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
          },
        }
      );
      toast.success('Item group updated successfully!');
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Delete an item group
export const deleteItemGroup = createAsyncThunk(
  'itemGroups/deleteItemGroup',
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${BASE_URL}/admin/inventory/item-group/${id}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
          },
        }
      );
      toast.success('Item group deleted successfully!');
      return id;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

const itemGroupSlice = createSlice({
  name: 'itemGroups',
  initialState: {
    itemGroups: [],
    selectedItemGroup: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedItemGroup: (state, action) => {
      state.selectedItemGroup = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all item groups
      .addCase(getItemGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getItemGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.itemGroups = action.payload;
      })
      .addCase(getItemGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get item group by ID
      .addCase(getItemGroupById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getItemGroupById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedItemGroup = action.payload;
      })
      // Add item group
      .addCase(addItemGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItemGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.itemGroups.push(action.payload);
      })
      .addCase(addItemGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete item group
      .addCase(deleteItemGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteItemGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.itemGroups = state.itemGroups.filter((group) => group._id !== action.payload);
      })
      .addCase(deleteItemGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update item group
      .addCase(updateItemGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateItemGroup.fulfilled, (state, action) => {
        state.loading = false;
        const updatedGroup = action.payload;
        // Find the group in the array and update it
        const index = state.itemGroups.findIndex(group => group._id === updatedGroup._id);
        if (index !== -1) {
          state.itemGroups[index] = updatedGroup;
        }
        // Also update selectedItemGroup if it's the same group
        if (state.selectedItemGroup && state.selectedItemGroup._id === updatedGroup._id) {
          state.selectedItemGroup = updatedGroup;
        }
      })
      .addCase(updateItemGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedItemGroup } = itemGroupSlice.actions;
export default itemGroupSlice.reducer;
