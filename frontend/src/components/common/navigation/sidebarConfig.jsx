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
// {
//   name :"Inventory Section",
//   title: "Inventory",
//   icon: MdInventory,
//   subItems: [
//     {title: "Dashboards", path: "/Inventory/dashboard" },
//     {title: "Items", path: "/Inventory/Items" },
//     {title: "ItemsGroup", path: "/Inventory/ItemsGroup"},
//     {title: "Vendor", path: "/Inventory/Vendor"},
//     {title: "Purchase Order", path: "/Inventory/PurchaseOrder"},
//     {title: "Purchase Received", path: "/Inventory/PurchaseReceived"},
//     {title: "Purchase Bill", path: "/Inventory/PurchaseBill"},
//     {title: "Bill Payments ", path: "/Inventory/BillPayments"},
//     {title: "Sale Order", path: "/Inventory/SaleOrder"},
//     {title: "Package", path: "/Inventory/Package/List"},
//     {title: "Shipment", path: "/Inventory/Shipment/List"},
//     {title: "Sale Invoice", path: "/Inventory/SaleInvoice/List"},
//     {title: "Sales Returns", path: "/Inventory/SalesReturn/List"},
//     {title: "Invoice Payments", path: "/Inventory/InvoicePayments"},
//     {title: "Inventory Setting", path: "/Inventory/InventorySetting"},
//   ]
// },

{
  name: "Inventory Section",
  title: "Inventory",
  icon: MdInventory,
  subGroups: [
        {
      groupTitle: "Inventory",
      subItems: [
        {title: "Dashboards", path: "/Inventory/dashboard" },
        { title: "Items", path: "/Inventory/Items" },
        { title: "ItemsGroup", path: "/Inventory/ItemsGroup" },
        { title: "Vendor", path: "/Inventory/Vendor" },
      ],
    },
    {
      groupTitle: "Purchase",
      subItems: [
        { title: "Purchase Order", path: "/Inventory/PurchaseOrder" },
        { title: "Purchase Received", path: "/Inventory/PurchaseReceived" },
        { title: "Purchase Bill", path: "/Inventory/PurchaseBill" },
        { title: "Bill Payments", path: "/Inventory/BillPayments" },
      ],
    },
    {
      groupTitle: "Sales",
      subItems: [
        { title: "Sale Order", path: "/Inventory/SaleOrder" },
        { title: "Package", path: "/Inventory/Package/List" },
        { title: "Shipment", path: "/Inventory/Shipment/List" },
        { title: "Sale Invoice", path: "/Inventory/SaleInvoice/List" },
        { title: "Sales Returns", path: "/Inventory/SalesReturn/List" },
        { title: "Invoice Payments", path: "/Inventory/InvoicePayments" },
      ],
    },
    {
      groupTitle: "Settings",
      subItems: [
        { title: "Inventory Setting", path: "/Inventory/InventorySetting" },
      ],
    },
  ],
}
];

export default navItems