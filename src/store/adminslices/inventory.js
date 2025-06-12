import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_API_URL;

// Async thunk to fetch items
export const fetchItems = createAsyncThunk(
  "inventory/fetchItems", // Action type updated
  async (_, thunkAPI) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/inventory/item`,
        {}, // Empty body
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "46gyioi6n5h87kygf2w68r4p",
            authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);

// Create Redux slice
const inventorySlice = createSlice({
  name: "inventory",
  initialState: {
    locations: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetchItems states
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.locations = action.payload; // Directly assign fetched data
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload || "Failed to fetch locations"); // Show error message
      });
  },
});

export default inventorySlice.reducer;
