import { Routes, Route, Navigate } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";

import Login from "../pages/SuperAdmin/authentication/Login";
import Dashboard from "../pages/SuperAdmin/dashboard/Dashboard";
import Alternative from "../pages/SuperAdmin/dashboard/Alternative";
import ForgotPassword from "../pages/SuperAdmin/authentication/ForgotPassword";
import Signup from "../pages/SuperAdmin/authentication/Signup";
import CreateLocation from "../pages/SuperAdmin/location/CreateLocation";
import LocationDetails from "../pages/SuperAdmin/location/LocationDetails";
import CreateCefe from "../pages/SuperAdmin/cafe/CreateCefe";
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
import { Items } from "../components/common/inventory/items";
import { ItemsGroup } from "../components/common/inventory/itemsGroup";
import { ItemCreate } from "../components/common/inventory/itemCreate";
import { IitemGroupCreate } from "../components/common/inventory/iitemGroupCreate";
import { VendorCreate } from "../components/common/inventory/vendorCreate";
import { PurchaseReceived } from "../components/common/inventory/purchaseReceived";
import { PurchaseOrder } from "../components/common/inventory/purchaseOrder";
import { PurchaseOrderCreate } from "../components/common/inventory/purchaseOrderCreate";
import { PurchaseBill } from "../components/common/inventory/purchaseBill";
import { SaleOrder } from "../components/common/inventory/saleOrder";
import { SaleInvoice } from "../components/common/inventory/saleInvoice";
import { InvoicePayments } from "../components/common/inventory/invoicePayments";
import { InventorySetting } from "../components/common/inventory/inventorySetting";
import { BillPayments } from "../components/common/inventory/billPayments";
import { VendoreDetails } from "../components/common/inventory/details/vendorDetails";
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
import { CreateVendorForm } from "../pages/Admin/Inventory/Create/CreateVendorForm";
import PurchaseOrderList from "../pages/Admin/Inventory/List/PurchaseOrderList";
import ItemsList from "../pages/Admin/Inventory/List/ItemsList";
import CreateItemsForm from "../pages/Admin/Inventory/Create/CreateItemsForm";
import ItemGroupList from "../pages/Admin/Inventory/List/ItemGroupList";
import ItemGroupForm from "../pages/Admin/Inventory/Create/ItemGroupForm";
import ItemDetails from "../pages/Admin/Inventory/Details/ItemDetails";
import ItemGroupsDetails from "../pages/Admin/Inventory/Details/ItemGroupsDetails";

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
          <Route path="/superadmin/dashboard/alternative" element={<Alternative />} />
          <Route path="/superadmin/create-location" element={<CreateLocation locations={locations} setLocations={setLocations} />} />
          <Route path="/superadmin/location-details" element={<LocationDetails locations={locations} />} />
          <Route path="/superadmin/create-cafe" element={<CreateCefe />} />
          <Route path="/superadmin/cafe-details" element={<CafeDetails />} />
          <Route path="/superadmin/create-games" element={<CreateGames />} />
          <Route path="/superadmin/games/create" element={<GameManager />} />
          <Route path="/superadmin/cafe/viewdetails/:cafeId" element={<ViewDetails />} />
          <Route path="/superadmin/subscription" element={<CreatesubScription />} />
          <Route path="/superadmin/create-table" element={<CreateTable />} />

          <Route path="/Inventory/Dashboard" element={<Dashboards />} />
          <Route path="/Inventory/Items" element={<Items />} />
          <Route path="/Inventory/ItemsGroup" element={<ItemsGroup />} />
          <Route path="/Inventory/vendor" element={<Vendor />} />
          <Route path="/Inventory/itemCreate" element={<ItemCreate />} />
          <Route path="/Inventory/ItemGroupCreate" element={<IitemGroupCreate />} />
          <Route path="/Inventory/vendorCreate" element={<VendorCreate />} />
          <Route path="/Inventory/PurchaseOrder" element={<PurchaseOrder />} />
          <Route path="/Inventory/PurchaseReceived" element={<PurchaseReceived />} />
          <Route path="/Inventory/PurchaseOrderCreate" element={<PurchaseOrderCreate />} />
          <Route path="/Inventory/PurchaseBill" element={<PurchaseBill />} />
          <Route path="/Inventory/BillPayments" element={<BillPayments />} />
          <Route path="/Inventory/SaleOrder" element={<SaleOrder />} />
          <Route path="/Inventory/SaleInvoice" element={<SaleInvoice />} />
          <Route path="/Inventory/InvoicePayments" element={<InvoicePayments />} />
          <Route path="/Inventory/InventorySetting" element={<InventorySetting />} />

          <Route path="/Inventory/VendorDetails" element={<VendoreDetails />} />
          <Route path="/Inventory/ItemDetails" element={<ItemsDetails />} />
          <Route path="/Inventory/PurchaseOrderDetails" element={<PODetails />} />
        </Route>
      </Route>

      {/*-------------------- Admin Routes-------------------------------- */}
      <Route element={<AdminRoute isAuthenticated={isAuthenticated} />}>
        <Route element={<AdminLayout setIsAuthenticated={setIsAuthenticated} />}>
          <Route path="/admin/profile" element={<ViewProfile />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          <Route path="/admin/games/recommended" element={<RecommendedGames />} />
          <Route path="/admin/games/:gameId" element={<GameInfo />} />
          <Route path="/admin/games" element={<GameInfo />} />
          <Route path="/admin/games/create-new-game" element={<CreateNewGameForm />} />
          <Route path="/admin/games/edit-game/:id" element={<CreateNewGameForm />} />

          <Route path="/admin/bookings/create-slots" element={<CreateSlotsForm />} />
          <Route path="/admin/bookings/booking-details" element={<BookingDetails />} />

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
          <Route path="/admin/inventory/item-details" element={<ItemDetails />} />
          <Route path="/admin/inventory/item-groups-details" element={<ItemGroupsDetails />} />
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
                    ? "/admin/dashboard"
                    : "/admin/login"
                : "/user/login"
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
                    ? "/admin/dashboard"
                    : "/user/dashboard"
                : "/user/login"
            }
            replace
          />
        }
      />
    </Routes>
  );
};

export default AppRoutes;