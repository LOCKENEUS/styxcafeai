import { configureStore } from '@reduxjs/toolkit';
import subscriptionReducer from './slices/subscriptionSlice';
import gameReducer from './slices/gameSlice';
import cafeReducer from './slices/cafeSlice';
import tableReducer from './slices/tableSlice';
import authReducer from './slices/authSlice';
import locationReducer from './slices/locationSlice';
import slotReducer from './slices/slotsSlice';
import offerReducer from './slices/offerSlice';
import membershipReducer from './slices/MembershipSlice';

// Admin Slices
import inventoryReducer from './adminslices/inventory';
import customerReducer from './AdminSlice/CustomerSlice';
import userReducer from './AdminSlice/UserSlice';

export const store = configureStore({
  reducer: {
    subscriptions: subscriptionReducer,
    games: gameReducer,
    cafes: cafeReducer,
    tables: tableReducer,
    auth: authReducer,
    locations: locationReducer,
    slots: slotReducer,
    offers: offerReducer, // Ensure 'offers' matches useSelector((state) => state.offers)
    memberships: membershipReducer, // Ensure 'memberships' matches useSelector((state) => state.memberships)

    // Admin Slices
    inventory: inventoryReducer,
    customers: customerReducer,
    users: userReducer,
  },
});