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
          { title: "Create Customer", path: "/admin/users/create-customer" },
          { title: "Customer List", path: "/admin/users/customer-list" },
          { title: "Create User", path: "/admin/users/create-user" },
          { title: "User List", path: "/admin/users/user-list" },
          { title: "Customer Details", path: "/admin/users/customer-details" },
          // { title: "Staff Members", path: "/admin/users/staff" },
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
          { title: "Create Slots", path: "/admin/bookings/create-slots" }
        ]
      },
      // { title: "Game Bookings List", path: "/admin/bookings/list" },
      // { title: "Event Bookings List", path: "/admin/bookings/event" },
      // { title: "Booking History", path: "/admin/bookings/history" },
    ]
  },

  {
    title: "Cafe",
    icon: SlCup,
    subItems: [
      {
        label: "",
        sub: [
          // { title: "Menu Items", path: "/admin/cafe/menu" },
          // { title: "Orders", path: "/admin/cafe/orders" },
          // { title: "Inventory", path: "/admin/cafe/inventory" }
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
          { title: "Bookings", path: "/admin/games/bookings" },
          // { title: "Maintenance", path: "/admin/games/maintenance" },
          { title: "Create New Game", path: "/admin/games/create-new-game" }
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
      { title: "Items List", path: "/admin/inventory/items-list" },
      { title: "Item Group List", path: "/admin/inventory/item-group-list" },
        ]
      
      },
      {
        label: "Vendor",
        sub :[
          {title: "Vendor List", path: "/admin/inventory/vendor-list"},
          { title: "Purchase Order List", path: "/admin/inventory/purchase-order-list" },
        ]
      
      },
     
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


