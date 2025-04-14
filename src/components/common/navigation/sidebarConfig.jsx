// config/sidebarConfig.js
import {
  BiHomeAlt
} from 'react-icons/bi';
import { CiLocationOn } from 'react-icons/ci';
import {  IoGameControllerOutline } from 'react-icons/io5';
import { MdInventory, MdOutlineSubscriptions, MdOutlineTableRestaurant, MdTableRestaurant } from 'react-icons/md';
import { SlCup } from 'react-icons/sl';

 const navItems = [
  {
    name:"Location Section",
    title: "Location",
    icon: CiLocationOn,
    subItems: [
      { title: "Create Location", path: "/superadmin/create-location" },
      // { title: "Location Details", path: "/superadmin/location-details" }
    ]
  },
  {
    name:"Cafe Section",
    title: "Cafe",
    icon: SlCup ,
    subItems: [
      { title: "Create Cafe", path: "/superadmin/cafeList" },
      // { title: "Cafe Information", path: "/superadmin/cafe-details" },
    ]
  },
  // {
  //   name :"Gaming Section",
  //   title: "Games",
  //   icon: IoGameControllerOutline,
  //   subItems: [
  //     { title: "Create Games", path: "/superadmin/create-games" },
  //     { title: "Game Info", path: "/superadmin/game-info" },
  //   ]
  // },
  {
    name :"subscription Section",
    title: "Subscription",
    icon: MdOutlineSubscriptions,
    subItems: [
      { title: "Create subscription", path: "/superadmin/subscription" },
    ]
  },


  // ---------------------------      Inventory Section      ---------------------------


// Dashboards
{
  name :"Inventory Section",
  title: "Inventory",
  icon: MdInventory,
  subItems: [
    {title: "Dashboards", path: "/Inventory/dashboard" },
    {title: "Items", path: "/Inventory/Items" },
    {title: "ItemsGroup", path: "/Inventory/ItemsGroup"},
    {title: "Vendor", path: "/Inventory/Vendor"},
    {title: "Purchase Order", path: "/Inventory/PurchaseOrder"},
    {title: "Purchase Received", path: "/Inventory/PurchaseReceived"},
    {title: "Purchase Bill", path: "/Inventory/PurchaseBill"},
    {title: "Bill Payments ", path: "/Inventory/BillPayments"},
    {title: "Sale Order", path: "/Inventory/SaleOrder"},
    {title: "Sale Invoice", path: "/Inventory/SaleInvoice"},
    {title: "Invoice Payments", path: "/Inventory/InvoicePayments"},
    {title: "Inventory Setting", path: "/Inventory/InventorySetting"},
    
    
  ]

    
},



// ----------------------------------------------------------------------------------------------





  // {
  //   name :"Table Section",
  //   title: "Table",
  //   icon: MdOutlineTableRestaurant,
  //   subItems: [
  //     { title: "Create subscription", path: "/superadmin/create-table" },
  //   ]
  // },
  // Add other menu items following the same pattern
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