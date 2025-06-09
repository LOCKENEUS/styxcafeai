import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = import.meta.env.VITE_API_URL;

// Fetch all dashboards
export const getDashboardData = createAsyncThunk(
  'dashboard/getDashboardData',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/superadmin/dashboard/data`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    dashboardData: [],
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedOffer: (state, action) => {
      state.selectedOffer = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all dashboards
      .addCase(getDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardData = action.payload;
      })
      .addCase(getDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export default dashboardSlice.reducer;
