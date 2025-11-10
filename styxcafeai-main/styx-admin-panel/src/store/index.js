import { configureStore } from '@reduxjs/toolkit';
import collectPaymentReducer from './AdminSlice/Inventory/CollectPaymentSlice';

// ... other imports ...

export const store = configureStore({
  reducer: {
    // ... other reducers ...
    payment: collectPaymentReducer,
  },
}); 