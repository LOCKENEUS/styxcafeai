import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_API_URL;

// Fetch Dashboard Data
export const getInvDashboardData = createAsyncThunk(
  "invDashboard/getData",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/admin/inventory/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

const invDashboardSlice = createSlice({
  name: "invDashboard",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {}, // No need for extra actions if not used
  extraReducers: (builder) => {
    builder
      .addCase(getInvDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getInvDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getInvDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default invDashboardSlice.reducer;
