import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

// Async thunk to fetch bookings
export const getBookings = createAsyncThunk(
  "bookings/getbookings",
  async (cafeId, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/admin/booking/list/${cafeId}`
      );
      console.log(response.data.data);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);

// Async thunk to add a new booking
export const addBooking = createAsyncThunk(
  "bookings/addbooking",
  async (bookingData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/admin/booking`,
        bookingData
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);

// Async thunk to update an existing booking
export const updateBooking = createAsyncThunk(
  "bookings/updatebooking",
  async ({ id, updatedData }, thunkAPI) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/superadmin/booking/${id}`,
        updatedData
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);

export const getBookingDetails = createAsyncThunk(
  "bookings/bookingDetails",
  async ({ id }, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/superadmin/booking/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);

// Async thunk to delete a booking
export const deleteBooking = createAsyncThunk(
  "bookings/deletebooking",
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${BASE_URL}/superadmin/booking/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);

const bookingslice = createSlice({
  name: "bookings",
  initialState: {
    bookings: [],
    booking: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch bookings
      .addCase(getBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(getBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch booking details
      .addCase(getBookingDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBookingDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.booking = action.payload.data;
      })
      .addCase(getBookingDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add booking
      .addCase(addBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings.push(action.payload.data);
      })
      .addCase(addBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update booking
      .addCase(updateBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        state.loading = false;
        const updatedbooking = action.payload.data; // Get updated booking from response
        const index = state.bookings.findIndex(
          (loc) => loc._id === updatedbooking._id
        ); // Use _id instead of id
        if (index !== -1) {
          state.bookings[index] = updatedbooking; // Update state
        }
      })
      .addCase(updateBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete booking
      .addCase(deleteBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = state.bookings.filter((loc) => loc._id !== action.payload); // Use _id instead of id
      })
      .addCase(deleteBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default bookingslice.reducer;
