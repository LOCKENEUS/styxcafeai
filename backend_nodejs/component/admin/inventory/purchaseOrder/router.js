const express = require("express");
const Router = express.Router();
const upload = require("../../../../middleware/imageUpload");
const paymentRouter = require("./payments/router");
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
  convertToPurchaseBill,
  getItemQuantities,
  sendMailToClient,
  getCafePurchaseOrders,
} = require("./controller");
const auth = require("../../../../middleware/auth");

// Purchase Order
Router.route("/").post(
  auth,
  upload.array("internal_team_file", 5),
  createPurchaseOrder
);
Router.route("/:id")
  .get(auth, getPurchaseOrderById)
  .put(auth, upload.array("internal_team_file", 5), updatePurchaseOrder);

Router.route("/receive-qty/:id").get(auth, getItemQuantities);

Router.route("/list/:id").get(auth, getAllPurchaseOrders);
Router.route("/list/:id/:vendor_id").get(auth, getPurchaseOrdersByVendor);
Router.route("/cafe/list/:id").get(auth, getCafePurchaseOrders);

// Purchase Receive
Router.route("/receive").post(auth, createPurchaseReceive);
Router.route("/receive/:id").get(auth, getPurchaseReceiveById);
Router.route("/receive/list/:id").get(auth, getAllPurchaseReceives);
// Router.route("/receive/bill-create/:id").post(convertToPurchaseBill);

// Purchase Bill
Router.route("/bill").post(auth, createPurchaseBill);
Router.route("/bill/:id").put(auth, updatePurchaseBill);
Router.route("/bill/list/:id").get(auth, getAllPurchaseBills);

Router.use("/bill/payment", paymentRouter);

Router.use("/send-mail", sendMailToClient);

module.exports = Router;
