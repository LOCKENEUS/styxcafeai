const express = require("express");
const Router = express.Router();
const upload = require("../../../../middleware/imageUpload");
const paymentRouter = require("./payments/router");
const cors = require("cors");
const { createSalesOrder, getSalesOrderList, updateSalesOrder, getSalesOrderDetails, createSalesInvoice, getSalesInvoiceList, getSalesInvoiceDetails, updateSalesInvoice } = require("./controller");


// Sales Order
Router.route("/").post(upload.array("internal_team_file", 5), createSalesOrder);
Router.route("/:id")
  .get(getSalesOrderDetails)
  .put(upload.array("internal_team_file", 5), updateSalesOrder)
//   .delete(deleteItem);
  
Router.route("/list/:id").get(getSalesOrderList);

Router.route("/invoice").post(createSalesInvoice);
Router.route("/invoice/:id")
  .get(getSalesInvoiceDetails)
  .put(updateSalesInvoice)
  
Router.route("/invoice/list/:id").get(getSalesInvoiceList);

Router.use("/invoice/payment", paymentRouter);

module.exports = Router;
