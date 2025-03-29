import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

// Timer Actions
export const startBookingTimer = createAsyncThunk(
  "bookings/startTimer",
  async (bookingId, thunkAPI) => {
    try {
      const { data } = await axios.put(
        `${BASE_URL}/admin/booking/start-timer/${bookingId}`
      );
      return data.start_time;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error starting timer"
      );
    }
  }
);

export const pauseBookingTimer = createAsyncThunk(
  "bookings/pauseTimer",
  async (bookingId, thunkAPI) => {
    try {
      const { data } = await axios.put(
        `${BASE_URL}/admin/booking/pause-timer/${bookingId}`
      );
      return data.paused_time;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error pausing timer"
      );
    }
  }
);

export const resumeBookingTimer = createAsyncThunk(
  "bookings/resumeTimer",
  async (bookingId, thunkAPI) => {
    try {
      const { data } = await axios.put(
        `${BASE_URL}/admin/booking/resume-timer/${bookingId}`
      );
      return data.start_time;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error resuming timer"
      );
    }
  }
);

export const stopBookingTimer = createAsyncThunk(
  "bookings/stopTimer",
  async (bookingId, thunkAPI) => {
    try {
      const { data } = await axios.put(
        `${BASE_URL}/admin/booking/stop-timer/${bookingId}`
      );
      return data.total_price;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error stopping timer"
      );
    }
  }
);

const timerSlice = createSlice({
  name: "timer",
  initialState: {
    bookings: [],
    booking: null,
    loading: false,
    error: null,
    timer: {
      isRunning: false,
      isPaused: false,
      startTime: null,
      elapsedTime: 0,
      pausedTime: 0,
    },
  },
  reducers: {
    initializeTimer: (state, action) => {
      const booking = action.payload;
      if (booking) {
        state.timer.startTime = booking.start_time
          ? new Date(booking.start_time).getTime()
          : null;
        state.timer.pausedTime = booking.paused_time || 0;
        state.timer.elapsedTime = booking.total_time || 0;
        state.timer.isRunning =
          booking.timer_status === "Running" ? true : false;
        state.timer.isPaused = booking.timer_status === "Paused" ? true : false;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startBookingTimer.pending, (state) => {
        state.loading = true;
      })
      .addCase(startBookingTimer.fulfilled, (state, action) => {
        state.loading = false;
        state.timer.isRunning = true;
        state.timer.isPaused = false;
        state.timer.startTime = action.payload; // Store start time from backend
        state.timer.elapsedTime = 0; // Reset elapsed time
        state.timer.pausedTime = 0;
      })
      .addCase(startBookingTimer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Pause Timer
      .addCase(pauseBookingTimer.fulfilled, (state, action) => {
        state.timer.isRunning = false;
        state.timer.isPaused = true;
        state.timer.pausedTime = action.payload;
      })

      .addCase(resumeBookingTimer.fulfilled, (state, action) => {
        state.timer.isRunning = true;
        state.timer.isPaused = false;
        state.timer.startTime = Date.now() - state.timer.pausedTime * 1000;
      })

      .addCase(stopBookingTimer.fulfilled, (state, action) => {
        state.timer.isRunning = false;
        state.timer.isPaused = false;
        state.timer.startTime = null;
        state.timer.elapsedTime = 0;
        state.timer.pausedTime = action.payload;
      });
  },
});

export const { initializeTimer } = timerSlice.actions;

export default timerSlice.reducer;
