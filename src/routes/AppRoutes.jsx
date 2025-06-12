import { Routes, Route, Navigate } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";

import Login from "../pages/SuperAdmin/authentication/Login";
import Dashboard from "../pages/SuperAdmin/dashboard/Dashboard";
import ForgotPassword from "../pages/SuperAdmin/authentication/ForgotPassword";
import Signup from "../pages/SuperAdmin/authentication/Signup";
import CreateLocation from "../pages/SuperAdmin/location/CreateLocation";
import LocationDetails from "../pages/SuperAdmin/location/LocationDetails";
// import CreateCefe from "../pages/SuperAdmin/cafe/CreateCefe";
import ViewDetails from "../pages/SuperAdmin/cafe/ViewDetails";
import CafeDetails from "../pages/SuperAdmin/cafe/CefeDetails";
import CreateGames from "../pages/SuperAdmin/games/CreateGames";
import DashboardLayout from "../pages/SuperAdmin/layouts/DashboardLayout";
import ChangePassword from "../pages/SuperAdmin/authentication/ChangePassword";
import CreatesubScription from "../pages/SuperAdmin/subscription/CreatesubScription";
import CreateTable from "../pages/SuperAdmin/games/CreateTable";
import GameManager from "../pages/SuperAdmin/games/CreateGames";

import AdminLogin from "../pages/Admin/auth/Login";
import AdminSignup from "../pages/Admin/auth/Signup";
import AdminForgotPassword from "../pages/Admin/auth/ForgetPassword";
import AdminChangePassword from "../pages/Admin/auth/ResetPassword";
import AdminDashboard from "../pages/Admin/dashboard/AdminDashboard";
import AdminLayout from "../pages/Admin/layouts/DashboardLayout";
import RecommendedGames from "../pages/Admin/Games/RecommendedGames";
import ViewProfile from "../pages/Admin/profile/ViewProfile";
import CreateSlotsForm from "../pages/Admin/Booking/Slots/CreateSlotsForm";
import CreateNewGameForm from "../pages/Admin/Games/CreateNewGameForm";
import CreateCustomerForm from "../pages/Admin/Customer/CreateCustomerForm";
import CustomerList from "../pages/Admin/Customer/CustomerList";
import UserList from "../pages/Admin/User/UserList";
import CreateUserForm from "../pages/Admin/User/CreateUserForm";
import SnookerTableList from "../pages/Admin/Tables/SnookerTableList";
import TurfList from "../pages/Admin/Tables/TurfList";
import PickleTableList from "../pages/Admin/Tables/PickleTableList";
import CafeTableList from "../pages/Admin/Tables/CafeTableList";

// Inventory Components
import { Dashboards } from "../components/common/inventory";
import { Vendor } from "../components/common/inventory/vendor";
import { Items } from "../components/common/inventory/list/items";
import { ItemsGroup } from "../components/common/inventory/list/itemsGroup";
import { ItemCreate } from "../components/common/inventory/create/itemCreate";
import { IitemGroupCreate } from "../components/common/inventory/create/itemGroupCreate";
import { VendorCreate } from "../components/common/inventory/vendorCreate";
// import { PurchaseReceived } from "../components/common/inventory/purchaseReceived";
import { PurchaseOrder } from "../components/common/inventory/purchaseOrder";
import { PurchaseOrderCreate } from "../components/common/inventory/purchaseOrderCreate";
import { PurchaseBill } from "../components/common/inventory/purchaseBill";
import { SaleOrder } from "../components/common/inventory/saleOrder";
import { SaleInvoice } from "../components/common/inventory/saleInvoice";
import { InvoicePayments } from "../components/common/inventory/invoicePayments";
import { InventorySetting } from "../components/common/inventory/inventorySetting";
import { BillPayments } from "../components/common/inventory/billPayments";
import { ItemsDetails } from "../components/common/inventory/details/itemsDetails";
import { PODetails } from "../components/common/inventory/details/PODetails";

import UserLogin from "../pages/User/Login";
import { useState } from "react";
import GameInfo from "../pages/Admin/Games/GameInfo";
import CustomerDetails from "../pages/Admin/Customer/CustomerDetails";
import VendorList from "../pages/Admin/Inventory/List/VendorList";
import VendorDetails from "../pages/Admin/Inventory/Details/VendorDetails";
// import CreateVendorForm from "../pages/Admin/Inventory/Create/CreateVendorForm";
import PurchaseOrderForm from "../pages/Admin/Inventory/Create/PurchaseOrderForm";
import UserDetails from "../pages/Admin/User/UserDetails";
import PurchaseOrderDetailes from "../pages/Admin/Inventory/Details/PurchaseOrderDetailes";
import BookingDetails from "../pages/Admin/Booking/BookingDetails";
import GameDetails from "../pages/Admin/Games/GameDetails";
import BookingList from "../pages/Admin/Booking/BookingList";
import { CreateVendorForm } from "../pages/Admin/Inventory/Create/CreateVendorForm";
import PurchaseOrderList from "../pages/Admin/Inventory/List/PurchaseOrderList";
import ItemGroupList from "../pages/Admin/Inventory/List/ItemGroupList";
import ItemGroupForm from "../pages/Admin/Inventory/Create/ItemGroupForm";
import ItemDetails from "../pages/Admin/Inventory/Details/ItemDetails";
import ItemGroupsDetails from "../pages/Admin/Inventory/Details/ItemGroupsDetails";
import CreateItemsForm from "../pages/Admin/Inventory/Create/CreateItemsForm";
import ItemsList from "../pages/Admin/Inventory/List/ItemsList";
import DashboardInventory from "../pages/Admin/Inventory/List/dashboard";
// import { ItemInventory } from "../pages/Admin/Inventory/List/item";
import { SalesOrder } from "../pages/Admin/Inventory/List/salesOrder";
import { SaleInvoiceInventory } from "../pages/Admin/Inventory/List/salesInvoice";
import { InvoicePaymentInventory } from "../pages/Admin/Inventory/List/saleReturns";
import { InventorySettingAdmin } from "../pages/Admin/Inventory/List/inventorySetting";
import { SODetails } from "../pages/Admin/Inventory/Details/SODetails";
import { SIDetails } from "../pages/Admin/Inventory/Details/SIDetails";
import { IPDetails } from "../pages/Admin/Inventory/Details/IPDetails";
import SOCreate from "../pages/Admin/Inventory/Create/SOCreate";
import { InvoiceCreate } from "../pages/Admin/Inventory/Create/invoiceCreate";
import BillPaymentList from "../pages/Admin/Inventory/List/BillPaymentList";
import PurchaseBillList from "../pages/Admin/Inventory/List/PurchaseBillList";
import { PurchaseReceivedAdmin } from "../pages/Admin/Inventory/List/purchasereceive";
import { PRCreate } from "../pages/Admin/Inventory/Create/prCreate";
import { PurchaseReceivedDetails } from "../pages/Admin/Inventory/Details/purchaseReceived ";
import { PurchaseBillDetailsAdmin } from "../pages/Admin/Inventory/Details/purchaseBill";
import BookGames from "../pages/Admin/Booking/BookGames";
import PurchaseBillCreate from "../pages/Admin/Inventory/Create/PBCreate";
// import { BillPaymentDetails } from "../pages/Admin/Inventory/Details/billPayment";
import BookingCheckout from "../pages/Admin/Booking/BookingCheckout";
import { PurchaseOrderUpdate } from "../pages/Admin/Inventory/Update/PurchaseOrderUpdate ";
import BookingEdit from "../pages/Admin/Booking/BookingEdit";
import ParchaseBCreate from "../pages/Admin/Inventory/modal/ParchaseBCreate";
import CafeManager from "../pages/SuperAdmin/cafe/CefeList";
import CafeGames from "../pages/SuperAdmin/cafe/Games/CafeGames";
import CreateMembership from "../pages/SuperAdmin/cafe/membership/CreateMembership";
import GameDetailsCafe from "../pages/SuperAdmin/cafe/Games/GameDetails";
import BookingDetailsPage from "../pages/SuperAdmin/cafe/booking/bookingDetailspage";
import ClientDetailsPage from "../pages/SuperAdmin/cafe/client/clientDetailspage";
import { ItemGroupDetail } from "../components/common/inventory/details/itemGroupDetail";
import { EditItem } from "../components/common/inventory/edit/editItem";
import { VendoreDetails } from "../components/common/inventory/details/vendorDetails";
import { PoUpdate } from "../components/common/inventory/poUpdate";
import { PurchaseReceivedCreate } from "../components/common/inventory/PurchaseReceivedCreate";
import { PurchaseReceived } from "../components/common/inventory/purchaseReceived";
import { PrDetails } from "../components/common/inventory/prDetails";
import { PBCreate } from "../components/common/inventory/PurchaseBillCreate";
import { PurchaseBillDetails } from "../components/common/inventory/details/PurchaseBill";
import { CreateSo } from "../components/common/inventory/SalesOrder/CreateSO";
import { SoDetails } from "../components/common/inventory/SalesOrder/SODetails";
import { CreatePackage } from "../components/common/inventory/Package/CreatePackage";
import { PackageList } from "../components/common/inventory/Package/PackageList";
import { PackageDetails } from "../components/common/inventory/Package/PackageDetails";
import { CreateShipment } from "../components/common/inventory/Shipment/CreateShipment";
import { ShipmentList } from "../components/common/inventory/Shipment/ShipmentList";
import { ShipmentDetails } from "../components/common/inventory/Shipment/ShipmentDetails";
import { SalesInvList } from "../components/common/inventory/SalesInvoice/SalesInvList";
import { CreateSalesInv } from "../components/common/inventory/SalesInvoice/CreateSalesInv";
import { SalesInvDetails } from "../components/common/inventory/SalesInvoice/SalesInvDetails";
import { CreateSalesReturn } from "../components/common/inventory/SalesReturns/CreateSalesReturn";
import { SalesReturnDetails } from "../components/common/inventory/SalesReturns/SalesReturnDetails";
import { SalesReturnList } from "../components/common/inventory/SalesReturns/SalesReturnList";
import { Reports } from "../pages/Admin/Reports/Reports";
import SplashAnimation from "../components/utils/Animations/SplashAnimation";
import { BookingsReport } from "../pages/Admin/Reports/BookingsReport";
import { CommissionReport } from "../pages/Admin/Reports/CommissionReport";

const AppRoutes = ({ setIsAuthenticated, isAuthenticated }) => {
  const [locations, setLocations] = useState([]);

  return (
    <Routes>
      {/* ---------------------Public Routes--------------------------- */}
      <Route element={<PublicRoute isAuthenticated={isAuthenticated} />}>
        <Route path="/superadmin/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/admin/login" element={<AdminLogin setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/user/login" element={<UserLogin setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
        <Route path="/admin/change-password" element={<AdminChangePassword />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />
      </Route>

      {/*-------------------- Super Admin Routes-------------------------------- */}
      <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
        <Route element={<DashboardLayout setIsAuthenticated={setIsAuthenticated} />}>
          <Route path="/superadmin/dashboard" element={<Dashboard />} />
          <Route path="/superadmin/create-location" element={<CreateLocation locations={locations} setLocations={setLocations} />} />
          <Route path="/superadmin/location-details" element={<LocationDetails locations={locations} />} />
          <Route path="/superadmin/cafeList" element={<CafeManager />} />
          <Route path="/superadmin/cafe-details" element={<CafeDetails />} />
          <Route path="/superadmin/Games/cafeGames" element={<GameDetailsCafe />} />
          <Route path="/superadmin/create-games" element={<CreateGames />} />
          <Route path="/superadmin/games/create" element={<GameManager />} />
          <Route path="/superadmin/cafe/viewdetails/" element={<ViewDetails />} />
          <Route path="/superadmin/subscription" element={<CreatesubScription />} />
          <Route path="/superadmin/create-table" element={<CreateTable />} />

          <Route path="/Inventory/Dashboard" element={<Dashboards />} />
          <Route path="/Inventory/Items" element={<Items />} />
          <Route path="/Inventory/Items/ItemEdit" element={<EditItem />} />
          <Route path="/Inventory/ItemsGroup" element={<ItemsGroup />} />
          <Route path="/Inventory/ItemsGroupDetails" element={<ItemGroupDetail />} />
          <Route path="/Inventory/vendor" element={<Vendor />} />
          <Route path="/Inventory/itemCreate" element={<ItemCreate />} />
          <Route path="/Inventory/ItemGroupCreate" element={<IitemGroupCreate />} />
          <Route path="/Inventory/ItemGroupCreate/:id" element={<IitemGroupCreate />} />
          <Route path="/Inventory/vendorCreate" element={<VendorCreate />} />
          <Route path="/Inventory/Vendor/Edit/:id" element={<VendorCreate />} />
          <Route path="/Inventory/PurchaseOrder" element={<PurchaseOrder />} />
          <Route path="/Inventory/PurchaseReceived" element={<PurchaseReceived />} />
          <Route path="/Inventory/PurchaseReceivedCreate" element={<PurchaseReceivedCreate />} />
          <Route path="/Inventory/PurchaseReceive" element={<PrDetails />} />
          <Route path="/Inventory/PurchaseOrderCreate" element={<PurchaseOrderCreate />} />
          <Route path="/Inventory/PurchaseBill" element={<PurchaseBill />} />
          <Route path="/Inventory/PurchaseBillCreate" element={<PBCreate />} />
          <Route path="/Inventory/PurchaseBillCreate/:id" element={<PBCreate />} />
          <Route path="/Inventory/PurchaseBillDetails/:id" element={<PurchaseBillDetails />} />
          <Route path="/Inventory/BillPayments" element={<BillPayments />} />
          <Route path="/Inventory/SaleOrder" element={<SaleOrder />} />
          <Route path="/Inventory/SalesOrderCreate" element={<CreateSo />} />
          <Route path="/Inventory/SalesOrder/Edit/:id" element={<CreateSo />} />
          <Route path="/Inventory/SalesOrderDetails/:id" element={<SoDetails />} />
          <Route path="/Inventory/Package" element={<CreatePackage />} />
          <Route path="/Inventory/Package/View" element={<PackageDetails />} />
          <Route path="/Inventory/Package/List" element={<PackageList />} />
          <Route path="/Inventory/Shipment" element={<CreateShipment />} />
          <Route path="/Inventory/Shipment/:id" element={<CreateShipment />} />
          <Route path="/Inventory/Shipment/List" element={<ShipmentList />} />
          <Route path="/Inventory/Shipment/View" element={<ShipmentDetails />} />
          <Route path="/Inventory/SaleInvoice" element={<CreateSalesInv />} />
          <Route path="/Inventory/SaleInvoice/List" element={<SalesInvList />} />
          <Route path="/Inventory/SaleInvoice/View/:id" element={<SalesInvDetails />} />
          <Route path="/Inventory/SaleInvoice/Edit/:id" element={<CreateSalesInv />} />
          <Route path="/Inventory/InvoicePayments" element={<InvoicePayments />} />
          <Route path="/Inventory/InventorySetting" element={<InventorySetting />} />

          <Route path="/Inventory/SalesReturn" element={<CreateSalesReturn />} />
          <Route path="/Inventory/SalesReturn/View/:id" element={<SalesReturnDetails />} />
          <Route path="/Inventory/SalesReturn/List/" element={<SalesReturnList />} />

          <Route path="/Inventory/VendorDetails/:id" element={<VendoreDetails />} />
          <Route path="/Inventory/ItemDetails" element={<ItemsDetails />} />
          <Route path="/Inventory/PurchaseOrderDetails/:id" element={<PODetails />} />
          <Route path="/Inventory/PurchaseOrder/Edit/:id" element={<PoUpdate />} />

          <Route path="/superadmin/CafeGames" element={<CafeGames />} />
          <Route path="/superadmin/CreateMembership" element={<CreateMembership />} />
          <Route path="/superadmin/Bookings/BookingDetails" element={<BookingDetailsPage />} />
          <Route path="/superadmin/Clients/ClientDetails" element={<ClientDetailsPage />} />
        </Route>
      </Route>

      {/*-------------------- Admin Routes-------------------------------- */}
      <Route element={<AdminRoute isAuthenticated={isAuthenticated} />}>
        <Route element={<AdminLayout setIsAuthenticated={setIsAuthenticated} />}>
          <Route path="/splash" element={<SplashAnimation />} />
          <Route path="/admin/profile" element={<ViewProfile />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          <Route path="/admin/games/recommended" element={<RecommendedGames />} />
          <Route path="/admin/games/:gameId" element={<GameInfo />} />
          <Route path="/admin/games" element={<GameInfo />} />
          <Route path="/admin/games/create-new-game" element={<CreateNewGameForm />} />
          <Route path="/admin/games/edit-game/:id" element={<CreateNewGameForm />} />
          <Route path="/admin/games/game-details/:id" element={<GameDetails />} />

          <Route path="/admin/bookings/create-slots" element={<CreateSlotsForm />} />
          <Route path="/admin/bookings/booking-details/:gameId/:slotId/:date" element={<BookingDetails />} />
          <Route path="/admin/bookings" element={<BookingList />} />
          <Route path="/admin/booking/games" element={<BookGames />} />
          <Route path="/admin/booking/checkout/:id" element={<BookingCheckout />} />
          <Route path="/admin/booking/edit/:id" element={<BookingEdit />} />


          <Route path="/admin/users/customer-list" element={<CustomerList />} />
          <Route path="/admin/users/create-customer" element={<CreateCustomerForm />} />
          <Route path="/admin/users/create-customer/:id" element={<CreateCustomerForm />} />
          <Route path="/admin/users/customer-details" element={<CustomerDetails />} />
          <Route path="/admin/users/customer-details/:id" element={<CustomerDetails />} />

          <Route path="/admin/users/user-list" element={<UserList />} />
          <Route path="/admin/users/create-user" element={<CreateUserForm />} />
          <Route path="/admin/users/create-user/:id" element={<CreateUserForm />} />
          <Route path="/admin/users/user-details/:id" element={<UserDetails />} />

          <Route path="/admin/tables/snooker-table-list" element={<SnookerTableList />} />
          <Route path="/admin/tables/pickle-ball-table-list" element={<PickleTableList />} />
          <Route path="/admin/tables/turf-list" element={<TurfList />} />
          <Route path="/admin/tables/cafe-table-list" element={<CafeTableList />} />

          <Route path="/admin/inventory/vendor-list" element={<VendorList />} />
          <Route path="/admin/inventory/vendor-details" element={<VendorDetails />} />
          <Route path="/admin/inventory/create-vendor" element={<CreateVendorForm />} />
          <Route path="/admin/inventory/purchase-order" element={<PurchaseOrderForm />} />
          <Route path="/admin/inventory/purchase-order-details" element={<PurchaseOrderDetailes />} />
          <Route path="/admin/inventory/purchase-order-list" element={<PurchaseOrderList />} />
          <Route path="/admin/inventory/items-list" element={<ItemsList />} />
          <Route path="/admin/inventory/create-items" element={<CreateItemsForm />} />
          <Route path="/admin/inventory/item-group-list" element={<ItemGroupList />} />
          <Route path="/admin/inventory/item-group-form" element={<ItemGroupForm />} />
          <Route path="/admin/inventory/item-group-form/:id" element={<ItemGroupForm />} />
          <Route path="/admin/inventory/item-details" element={<ItemDetails />} />
          <Route path="/admin/inventory/item-groups-details/:id" element={<ItemGroupsDetails />} />
          <Route path="/admin/inventory/bill-payments" element={<BillPaymentList />} />
          <Route path="/admin/inventory/item-details/:id" element={<ItemDetails />} />
          <Route path="/admin/inventory/edit/:id" element={<CreateItemsForm />} />
          <Route path="/admin/inventory/vendors/edit/:id" element={<CreateVendorForm />} />
          <Route path="/admin/inventory/vendor-details/:id" element={<VendorDetails />} />
          <Route path="/admin/inventory/item-groups-details" element={<ItemGroupsDetails />} />

          {/* -------------------- Inventory Routes new -------------------------------- */}
          <Route path="/admin/Inventory/dashboard" element={<DashboardInventory />} />
          {/* <Route path="/admin/Inventory/Items" element={<ItemInventory />} /> */}
          <Route path="/admin/Inventory/SalesOrder" element={<SalesOrder />} />
          <Route path="/admin/Inventory/SaleInvoice" element={<SaleInvoiceInventory />} />
          <Route path="/admin/Inventory/InvoicePayment" element={<InvoicePaymentInventory />} />
          <Route path="/admin/Inventory/InventorySetting" element={<InventorySettingAdmin />} />
          <Route path="/admin/Inventory/SaleOrderDetails/:id" element={<SODetails />} />
          <Route path="/admin/Inventory/SaleInvoiceDetails/:id" element={<SIDetails />} />
          <Route path="/admin/Inventory/InvoicePaymentDetails" element={<IPDetails />} />
          <Route path="/admin/Inventory/SaleOrderCreate" element={<SOCreate />} />
          <Route path="/admin/Inventory/SaleOrderCreate/:id" element={<SOCreate />} />
          <Route path="/admin/Inventory/InvoiceCreate" element={<InvoiceCreate />} />
          <Route path="/admin/Inventory/InvoiceCreate/:id" element={<InvoiceCreate />} />
          <Route path="/admin/inventory/purchase-bill-list" element={<PurchaseBillList />} />
          <Route path="/admin/inventory/purchaseReceived" element={<PurchaseReceivedAdmin />} />
          <Route path="/admin/inventory/purchaseReceivedCreate" element={<PRCreate />} />
          <Route path="/admin/inventory/PurchaseReceivedDetails" element={<PurchaseReceivedDetails />} />
          <Route path="/admin/inventory/PurchaseBillDetails/:id" element={<PurchaseBillDetailsAdmin />} />
          <Route path="/admin/inventory/PurchaseBillCreate" element={<PurchaseBillCreate />} />
          <Route path="/admin/inventory/PurchaseBillCreate/:id" element={<PurchaseBillCreate />} />
          <Route path="/admin/inventory/GenerateBill/:id" element={<ParchaseBCreate />} />

          {/* <Route path="/admin/inventory/BillPaymentDetails" element={<BillPaymentDetails />} /> */}
          <Route path="/admin/inventory/PurchaseOrderUpdate/:id" element={<PurchaseOrderUpdate />} />

          {/* Reports section */}
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/admin/bookings/report" element={<BookingsReport />} />
          <Route path="/admin/commission/report" element={<CommissionReport />} />
        </Route>
      </Route>

      {/*-------------------- User Routes -------------------------------- */}
      {/* Uncomment and add UserRoute/UserLayout if needed */}
      {/* <Route element={<UserRoute />}>
        <Route element={<UserLayout />}>
          <Route path="/user/dashboard" element={<UserDashboard />} />
        </Route>
      </Route> */}

      {/*-------------------- Redirects -------------------------------- */}
      <Route
        path="/"
        element={
          <Navigate
            to={
              isAuthenticated
                ? sessionStorage.getItem("userRole") === "superadmin"
                  ? "/superadmin/dashboard"
                  : sessionStorage.getItem("userRole") === "admin"
                    ? "/splash"
                    : "/admin/login"
                : "/admin/login"
            }
            replace
          />
        }
      />
      <Route
        path="*"
        element={
          <Navigate
            to={
              isAuthenticated
                ? sessionStorage.getItem("userRole") === "superadmin"
                  ? "/superadmin/dashboard"
                  : sessionStorage.getItem("userRole") === "admin"
                    ? "/splash"
                    : "/user/dashboard"
                : "/admin/login"
            }
            replace
          />
        }
      />
    </Routes>
  );
};

export default AppRoutes;