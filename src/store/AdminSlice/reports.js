import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_API_URL;

export const getCafeReportData = createAsyncThunk(
  "cafeReports/getCafeReportData",
  async ({id, filterData}, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/admin/reports/${id}`,
        filterData,
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
        "Error fetching report data: " +
          (error.response?.data?.message || "Something went wrong")
      );
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const getCafeBookingsReport = createAsyncThunk(
  "cafeReports/getCafeBookingsReport",
  async ({id, filterData}, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/admin/reports/bookings/data`,
        filterData,
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
        "Error fetching report data: " +
          (error.response?.data?.message || "Something went wrong")
      );
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

const cafeReportSlice = createSlice({
  name: "cafeReport",
  initialState: {
    cafeReport: null,
    bookingsReport: null,
    loading: false,
    error: null,
  },
  reducers: {
    setCafeReport: (state, action) => {
      state.cafeReport = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCafeReportData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCafeReportData.fulfilled, (state, action) => {
        state.loading = false;
        state.cafeReport = action.payload;
      })
      .addCase(getCafeReportData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getCafeBookingsReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCafeBookingsReport.fulfilled, (state, action) => {
        state.loading = false;
        state.bookingsReport = action.payload;
      })
      .addCase(getCafeBookingsReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { cafeReport } = cafeReportSlice.actions;
export default cafeReportSlice.reducer;
