import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_API_URL;

export const getAdminDashboardData = createAsyncThunk(
  "adminDashboard/getAdminDashboardData",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem(
              "authToken"
            )}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("API error:", error);
      toast.error(
        "Error fetching adminDashboard: " +
          (error.response?.data?.message || "Something went wrong")
      );
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const getSearchData = createAsyncThunk(
  "adminDashboard/getSearchData",
  async (query, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/dashboard/search?search=${query}`,  // /api/search?search=john
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem(
              "authToken"
            )}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("API error:", error);
      toast.error(
        "Error fetching adminDashboard: " +
          (error.response?.data?.message || "Something went wrong")
      );
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

const adminDashboardSlice = createSlice({
  name: "adminDashboard",
  initialState: {
    adminDashboard: null,
    searchResults: null,
    loading: false,
    error: null,
  },
  reducers: {
    setAdminDashboard: (state, action) => {
      state.adminDashboard = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch adminDashboard data
      .addCase(getAdminDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.adminDashboard = action.payload;
      })
      .addCase(getAdminDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Search data
      .addCase(getSearchData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSearchData.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(getSearchData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { adminDashboard } = adminDashboardSlice.actions;
export default adminDashboardSlice.reducer;
