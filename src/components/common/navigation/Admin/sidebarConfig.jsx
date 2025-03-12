// config/sidebarConfig.js
import {
  BiHomeAlt,
  BiUser,
  BiDollar
} from 'react-icons/bi';
import { CiLocationOn } from 'react-icons/ci';
import { IoGameControllerOutline } from 'react-icons/io5';
import { MdOutlineSubscriptions, MdOutlinePeople, MdOutlineAnalytics, MdTableBar, MdOutlineInventory } from 'react-icons/md';
import { SlCup } from 'react-icons/sl';

const navItems = [
  {
    title: "Dashboard",
    icon: BiHomeAlt,
    subItems: [
      {
        label: "",
        sub: [
          { title: "Overview", path: "/admin/dashboard" }
        ]
      },
      // { title: "Analytics", path: "/admin/dashboard/analytics" }
    ]
  },
  {
    title: "Users",
    icon: MdOutlinePeople,
    subItems: [
      {
        label: "",
        sub: [
          { title: "Customer List", path: "/admin/users/customer-list" },
          { title: "User List", path: "/admin/users/user-list" },
        ]
      },
    ]
  },
  {
    title: "Bookings",
    icon: BiUser,
    subItems: [
      {
        label: "",
        sub: [
          { title: "Book Games", path: "/admin/booking/games" },
          { title: "Booking List", path: "/admin/bookings" }
        ]
      },
    ]
  },
  {
    title: "Games",
    icon: IoGameControllerOutline,
    subItems: [
      {
        label: "",
        sub: [
          { title: "Recommended Games", path: "/admin/games/recommended" },
          { title: "Create Slots", path: "/admin/bookings/create-slots" }
           
        ]
      },
      // { title: "Game Library", path: "/admin/games/library" },
    ]
  },
  {
    title: "Memberships",
    icon: MdOutlineSubscriptions,
    subItems: [
      {
        label: "",
        sub: [
          // { title: "Active Plans", path: "/admin/memberships/active" },
          // { title: "Plan Management", path: "/admin/memberships/manage" }
        ]
      },
    ]
  },
  {
    title: "Inventory",
    icon: MdOutlineInventory,
    subItems: [
     
      {
        label: "Inventory",
        sub :[
          { title: "Dashboard Inventory", path: "/admin/Inventory/dashboard" },
      { title: "Items List", path: "/admin/inventory/items-list" },
      { title: "Item Group List", path: "/admin/inventory/item-group-list" },
        ]
      
      },
      {
        label: "Purchase",
        sub :[
          {title: "Vendor List", path: "/admin/inventory/vendor-list"},
          { title: "Purchase Order ", path: "/admin/inventory/purchase-order-list" },
          { title: "Purchase Received", path: "/admin/inventory/purchaseReceived" },
          { title: "Purchase Bill", path: "/admin/inventory/purchase-bill-list" },
          { title: "Bill Payments", path: "/admin/inventory/bill-payments" },
        ]
      
      },
      {
        label: "Sales",
        sub :[
          { title: "Sales Order", path: "/admin/Inventory/SalesOrder"},
          { title: "Sales Invoice", path: "/admin/Inventory/SaleInvoice"},
          { title: "Invoice Payment", path: "/admin/Inventory/InvoicePayment"},

        ]
      
      },
      {
        label: "Settings",
        sub :[
          { title: "Inventory Setting", path: "/admin/Inventory/InventorySetting"},
        ]
      
      },
     
      // { title: "Inventory Vendor List", path: "/admin/inventory/vendor-list" },
      // { title: "Inventory Vendor Details", path: "/admin/inventory/vendor-details" },
      { title: "Create Vendor", path: "/admin/inventory/create-vendor" },
      { title: "Purchase Order", path: "/admin/inventory/purchase-order" },
      { title: "Purchase Order Details", path: "/admin/inventory/purchase-order-details" },
      { title: " Items", path: "/admin/Inventory/Items" },
      // { title: "Sales Order", path: "/admin/Inventory/SalesOrder"},
      // { title: "Sales Invoice", path: "/admin/Inventory/SaleInvoice"},
      // { title: "Incoice Payment", path: "/admin/Inventory/InvoicePayment"},
      // { title: "Inventory Setting", path: "/admin/Inventory/InventorySetting"},
    ]
  },
  {
    title: "Reports",
    icon: MdOutlineAnalytics,
    subItems: [
      {
        label: "",
        sub: [
        // { title: "Sales Report", path: "/admin/reports/sales" },
        // { title: "Usage Analytics", path: "/admin/reports/analytics" }
        ]
      },
    ]
  },
  {
    title: "Tables",
    icon: MdTableBar,
    subItems: [
      {
        label: "",
        sub: [
        { title: "Snooker Table List", path: "/admin/tables/snooker-table-list" },
        { title: "Pickle Ball Table List", path: "/admin/tables/pickle-ball-table-list" },
        { title: "Turf List", path: "/admin/tables/turf-list" },
        { title: "Cafe Table List", path: "/admin/tables/cafe-table-list" },
        ]
      },
    ]
  },

  
];

// export const footerConfig = {
//   themeOptions: [
//     { label: "Auto (system default)", icon: BiMoon, value: "auto" },
//     { label: "Light Mode", icon: BiSun, value: "light" },
//     { label: "Dark Mode", icon: BiMoon, value: "dark" }
//   ],
//   helpOptions: [
//     { label: "Documentation", icon: BiBook, path: "/help/docs" },
//     { label: "Support", icon: BiInfoCircle, path: "/help/support" }
//   ],
//   languageOptions: [
//     { code: "en", label: "English", flag: "us" },
//     { code: "es", label: "Español", flag: "es" },
//     // Add other languages
//   ]
// };

export default navItems


