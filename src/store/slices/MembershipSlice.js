import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = import.meta.env.VITE_API_URL;

// Fetch all memberships
export const getMemberships = createAsyncThunk(
  'memberships/getMemberships',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/superadmin/membership`);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Fetch memberships by cafe ID
export const getMembershipsByCafeId = createAsyncThunk(
  'memberships/getMembershipsByCafeId',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/superadmin/membership/list/${id}`);
      console.log("membership function ",response.data.data);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Fetch a single membership by ID
export const getMembershipById = createAsyncThunk(
  'memberships/getMembershipById',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/superadmin/membership/${id}`);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Add a new membership
export const addMembership = createAsyncThunk(
  'memberships/addMembership',
  async (membershipData, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/superadmin/membership`, membershipData);
      toast.success('Membership added successfully!');
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Update an existing membership
export const updateMembership = createAsyncThunk(
  'memberships/updateMembership',
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await axios.patch(`${BASE_URL}/superadmin/membership/${id}`, data);
      toast.success('Membership updated successfully!');
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Delete a membership
export const deleteMembership = createAsyncThunk(
  'memberships/deleteMembership',
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${BASE_URL}/superadmin/membership/${id}`);
      toast.success('Membership deleted successfully!');
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

const membershipSlice = createSlice({
  name: 'memberships',
  initialState: {
    memberships: [],
    selectedMembership: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedMembership: (state, action) => {
      state.selectedMembership = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all memberships
      .addCase(getMemberships.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMemberships.fulfilled, (state, action) => {
        state.loading = false;
        state.memberships = action.payload;
      })
      .addCase(getMemberships.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch membership by ID
      .addCase(getMembershipById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMembershipById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedMembership = action.payload;
      })
      .addCase(getMembershipById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Membership
      .addCase(addMembership.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMembership.fulfilled, (state, action) => {
        state.loading = false;
        state.memberships.push(action.payload);
      })
      .addCase(addMembership.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Membership
      .addCase(updateMembership.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMembership.fulfilled, (state, action) => {
        state.loading = false;
        const updatedMembership = action.payload;
        const index = state.memberships.findIndex((membership) => membership._id === updatedMembership._id);
        if (index !== -1) {
          state.memberships[index] = updatedMembership;
        }
      })
      .addCase(updateMembership.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Memberships by Cafe ID
      .addCase(getMembershipsByCafeId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMembershipsByCafeId.fulfilled, (state, action) => {
        state.loading = false;
        state.memberships = action.payload;
      })
      .addCase(getMembershipsByCafeId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Membership
      .addCase(deleteMembership.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMembership.fulfilled, (state, action) => {
        state.loading = false;
        state.memberships = state.memberships.filter((membership) => membership._id !== action.payload);
      })
      .addCase(deleteMembership.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedMembership } = membershipSlice.actions;
export default membershipSlice.reducer;
