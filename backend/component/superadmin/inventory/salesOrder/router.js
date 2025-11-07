const express = require("express");
const Router = express.Router();
const upload = require("../../../../middleware/imageUpload");
const paymentRouter = require("./payments/router");
const cors = require("cors");
const {
  createSalesOrder,
  getSalesOrderList,
  getSalesOrderDetails,
  updateSalesOrder,
  getSalesOrderListByCafe,
  createPackage,
  getPackageList,
  getPackageDetails,
  createShipment,
  getShipmentList,
  getShipmentDetails,
  createSalesInvoice,
  getSalesInvoiceList,
  getSalesInvoiceDetails,
  updateSalesInvoice,
  createSalesReturn,
  getSalesReturnList,
  getSalesReturnDetails,
} = require("./controller");

// Sales Order
Router.route("/").post(upload.array("internal_team_file", 5), createSalesOrder);
Router.route("/list").get(getSalesOrderList);
Router.route("/list/:id").get(getSalesOrderListByCafe);
Router.route("/:id")
  .get(getSalesOrderDetails)
  .put(upload.array("internal_team_file", 5), updateSalesOrder);
//   .delete(deleteItem);

Router.route("/package").post(createPackage);
Router.route("/package/list").get(getPackageList);
Router.route("/package/:id").get(getPackageDetails);

Router.route("/shipment").post(createShipment);
Router.route("/shipment/list").get(getShipmentList);
Router.route("/shipment/:id").get(getShipmentDetails);

Router.route("/invoice").post(upload.array("internal_team_file", 5), createSalesInvoice);
Router.route("/invoice/list").get(getSalesInvoiceList);
Router.route("/invoice/:id")
  .get(getSalesInvoiceDetails)
  .put(upload.array("internal_team_file", 5), updateSalesInvoice)

// Router.route("/invoice/list/:id").get(getSalesInvoiceList);

// Router.use("/invoice/payment", paymentRouter);

Router.route("/return").post(upload.array("internal_team_file", 5), createSalesReturn);
Router.route("/return/list").get(getSalesReturnList);
Router.route("/return/:id")
  .get(getSalesReturnDetails)
//   .put(upload.array("internal_team_file", 5), updateSalesInvoice)

Router.use("/invoice/payment", paymentRouter);

module.exports = Router;
