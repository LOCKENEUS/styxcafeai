import { configureStore } from "@reduxjs/toolkit";
import subscriptionReducer from "./slices/subscriptionSlice";
import gameReducer from "./slices/gameSlice";
import cafeReducer from "./slices/cafeSlice";
import tableReducer from "./slices/tableSlice";
import authReducer from "./slices/authSlice";
import locationReducer from "./slices/locationSlice";
import slotReducer from "./slices/slotsSlice";
import offerReducer from "./slices/offerSlice";
import membershipReducer from "./slices/MembershipSlice";
import InventorySlice from "./slices/inventory";

// Admin Slices
import inventoryReducer from "./adminslices/inventory";
import customerReducer from "./AdminSlice/CustomerSlice";
import userReducer from "./AdminSlice/UserSlice";
import customFieldReducer from "./AdminSlice/CustomField";
import saCustomFieldReducer from "./slices/Inventory/customField";
import taxFieldReducer from "./AdminSlice/TextFieldSlice";
import itemsReducer from "./AdminSlice/Inventory/ItemsSlice";
import vendorReducer from "./AdminSlice/Inventory/VendorSlice";
import saVendorReducer from "./slices/Inventory/saVendorSlice";
import bookingsReducer from "./AdminSlice/BookingSlice";
import timerReducer from "./AdminSlice/TimerSlice";
import itemGroupReducer from "./AdminSlice/Inventory/ItemGroupSlice";
import purchaseOrderReducer from "./AdminSlice/Inventory/purchaseOrder";
import soReducer from "./AdminSlice/Inventory/SoSlice";
import purchaseReceiveSliceReducer from "./AdminSlice/Inventory/purchaseReceive";
import soInvoiceRouter from "./AdminSlice/Inventory/SoInvoiceSlice";
import CollectPaymentRouter from "./AdminSlice/Inventory/CollectPaymentSlice";
import CollectPurchaseBill from "./AdminSlice/Inventory/CollectPurchaseBill";
import pBillReducer from "./AdminSlice/Inventory/PBillSlice";
import adminDashboardReducer from "./AdminSlice/DashboardSlice";
import taxReducer from "./slices/tax";
import saPurchaseOrderReducer from "./slices/Inventory/poSlice";
import saPurchaseReceiveReducer from "./slices/Inventory/prSlice";
import saPurchaseBillReducer from "./slices/Inventory/pbSlice";
import saSalesOrderReducer from "./slices/Inventory/soSlice";
import saPackageReducer from "./slices/Inventory/packSlice";
import saShipmentReducer from "./slices/Inventory/shipSlice";
import saSalesInvoiceReducer from "./slices/Inventory/invoiceSlice";
import saSalesReturnReducer from "./slices/Inventory/returnSlice";

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
    adminDashboard: adminDashboardReducer,

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
    purchaseReceiveSlice: purchaseReceiveSliceReducer,
    purchaseReceiveSlice: purchaseReceiveSliceReducer,
    purchaseReceiveSlice: purchaseReceiveSliceReducer,
    so: soReducer,
    soInvoice: soInvoiceRouter,
    payment: CollectPaymentRouter,
    pBill: pBillReducer,
    purchaseBill: CollectPurchaseBill,
    // bookings
    bookings: bookingsReducer,
    timer: timerReducer,

    // super admin
    inventorySuperAdmin: InventorySlice,
    saVendor: saVendorReducer,
    tax: taxReducer,
    saCustomField: saCustomFieldReducer,
    saPurchaseOrder: saPurchaseOrderReducer,
    saPurchaseReceive: saPurchaseReceiveReducer,
    saPurchaseBill: saPurchaseBillReducer,
    saSalesOrder: saSalesOrderReducer,
    saPackage: saPackageReducer,
    saShipment: saShipmentReducer,
    saSalesInvoice: saSalesInvoiceReducer,
    saSalesReturn: saSalesReturnReducer
  },
});
