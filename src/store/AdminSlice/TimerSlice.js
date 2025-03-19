import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isRunning: false,
  startTime: null,
  elapsedTime: 0,
};

const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    startTimer: (state, action) => {
      state.isRunning = true;
      state.startTime = action.payload;
    },
    stopTimer: (state) => {
      state.isRunning = false;
      state.startTime = null;
      state.elapsedTime = 0;
    },
    updateTimer: (state, action) => {
      state.elapsedTime = action.payload;
    },
  },
});

export const { startTimer, stopTimer, updateTimer } = timerSlice.actions;
export default timerSlice.reducer;
