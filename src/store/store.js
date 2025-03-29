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
import customFieldReducer from './AdminSlice/CustomField';
import taxFieldReducer from './AdminSlice/TextFieldSlice';
import itemsReducer from './AdminSlice/Inventory/ItemsSlice';
import vendorReducer from './AdminSlice/Inventory/VendorSlice';
import bookingsReducer from './AdminSlice/BookingSlice';
import timerReducer from './AdminSlice/TimerSlice';
import itemGroupReducer from './AdminSlice/Inventory/ItemGroupSlice';
import purchaseOrderReducer from './AdminSlice/Inventory/purchaseOrder';
import soReducer from './AdminSlice/Inventory/SoSlice';
import purchaseReceiveSliceReducer from './AdminSlice/Inventory/purchaseReceive';
import soInvoiceRouter from './AdminSlice/Inventory/SoInvoiceSlice';
import CollectPaymentRouter from './AdminSlice/Inventory/CollectPaymentSlice';
import pBillReducer from './AdminSlice/Inventory/PBillSlice';

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
    customFields: customFieldReducer,
    taxFieldSlice: taxFieldReducer,
    items: itemsReducer,
    vendors: vendorReducer,
    itemGroups: itemGroupReducer,
    purchaseOrder: purchaseOrderReducer,
    purchaseReceiveSlice : purchaseReceiveSliceReducer,
    purchaseReceiveSlice : purchaseReceiveSliceReducer,
    purchaseReceiveSlice : purchaseReceiveSliceReducer,
    so: soReducer,
     soInvoice: soInvoiceRouter,
     payment: CollectPaymentRouter,
     pBill: pBillReducer,
        // bookings
        bookings: bookingsReducer,
        timer: timerReducer

  },
});