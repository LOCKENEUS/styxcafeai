const express = require("express");
const Router = express.Router();
const upload = require("../../../../middleware/imageUpload");
const cors = require("cors");
const {
  createPurchaseOrder,
  getAllPurchaseOrders,
  getPurchaseOrderById,
  updatePurchaseOrder,
  getPurchaseOrdersByVendor,
  createPurchaseReceive,
  getAllPurchaseReceives,
  getPurchaseReceiveById,
  createPurchaseBill,
  updatePurchaseBill,
  getAllPurchaseBills,
  sendMailToClient,
} = require("./controller");
const auth = require("../../../../middleware/auth");

// Purchase Order
Router.route("/").post(
  auth,
  upload.array("internal_team_file", 5),
  createPurchaseOrder
);

Router.route("/list").get(auth, getAllPurchaseOrders);

Router.route("/:id")
  .get(auth, getPurchaseOrderById)
  .put(auth, upload.array("internal_team_file", 5), updatePurchaseOrder);

Router.route("/list/:vendor_id").get(auth, getPurchaseOrdersByVendor);

// Purchase Receive
Router.route("/receive").post(auth, createPurchaseReceive);
Router.route("/receive/list").get(auth, getAllPurchaseReceives);
Router.route("/receive/:id").get(auth, getPurchaseReceiveById);

// // Purchase Bill
Router.route("/bill").post( auth, createPurchaseBill);
Router.route("/bill/list").get( auth, getAllPurchaseBills);
Router.route("/bill/:id").put( auth, updatePurchaseBill);

Router.use("/send-mail", sendMailToClient);

module.exports = Router;
