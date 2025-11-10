const express = require("express");
const Router = express.Router();
const cors = require("cors");
const { createPayment, getPaymentList, getPaymentListByInvoice } = require("./controller");


// Sales Order
Router.route("/").post(createPayment);
// Router.route("/:id")
//   .get(getSalesOrderDetails)
//   .put(upload.array("internal_team_file", 5), updateSalesOrder)
// //   .delete(deleteItem);
  
Router.route("/list/:id").get(getPaymentList);
Router.route("/invoice-payments/:id").get(getPaymentListByInvoice);

// Router.route("/invoice").post(createSalesInvoice);
// Router.route("/invoice/:id")
//   .get(getSalesInvoiceDetails)
//   .put(updateSalesInvoice)
  
// Router.route("/invoice/list/:id").get(getSalesInvoiceList);

module.exports = Router;
