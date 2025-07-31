import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_URL}/user`;

const initialState = {
  cafeDetails: null,
  gameDetails:null,
  loading: false,
  error: null,
};

export const fetchCafeDetails = createAsyncThunk(
  "user/fetchCafeDetails",
  async (id, thunkAPI) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${BASE_URL}/cafeDetails/${id}`);
      return response.data.data;
    } catch (error) {
      toast.error(
        "Error fetching cafe by ID: " +
          (error.response?.data?.message || "Something went wrong")
      );
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const fetchGameDetails = createAsyncThunk(
  "user/fetchGameDetails",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/gameDetails/${id}`);
      return response.data.data;
    } catch (error) {
      toast.error(
        "Error fetching game by ID: " +
          (error.response?.data?.message || "Something went wrong")
      );
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

const authSlice = createSlice({
  name: "user",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchCafeDetails.pending, (state) => {
          state.loading = true;
          state.error = null;
      })
      .addCase(fetchCafeDetails.fulfilled, (state, action) => {
          state.loading = false;
          state.cafeDetails = action.payload;
      })
      .addCase(fetchCafeDetails.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
      })

      .addCase(fetchGameDetails.pending, (state) => {
          state.loading = true;
          state.error = null;
      })
      .addCase(fetchGameDetails.fulfilled, (state, action) => {
          state.loading = false;
          state.gameDetails = action.payload;
      })
      .addCase(fetchGameDetails.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
      });
  },
});

export default authSlice.reducer;