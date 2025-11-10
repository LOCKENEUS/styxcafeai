import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  subscriptions: [],
  selectedSubscription: null,
};

const subscriptionSlice = createSlice({
  name: 'subscriptions',
  initialState,
  reducers: {
    addSubscription: (state, action) => {
      state.subscriptions.push(action.payload);
    },
    updateSubscription: (state, action) => {
      const { index, subscription } = action.payload;
      state.subscriptions[index] = subscription;
    },
    deleteSubscription: (state, action) => {
      state.subscriptions = state.subscriptions.filter((_, i) => i !== action.payload);
    },
    setSelectedSubscription: (state, action) => {
      state.selectedSubscription = action.payload;
    },
  },
});

export const { addSubscription, updateSubscription, deleteSubscription, setSelectedSubscription } = subscriptionSlice.actions;
export default subscriptionSlice.reducer; 