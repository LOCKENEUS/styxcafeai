const express = require("express");
const Router = express.Router();
const cors = require("cors");
const { createPayment, getPaymentList, getPaymentListByInvoice, getPaymentListByBill, getBillPaymentList } = require("./controller");

// Sales Order
Router.route("/").post(createPayment); 
Router.route("/list/:id").get(getBillPaymentList);
Router.route("/bill-payments/:id").get(getPaymentListByBill);

module.exports = Router;
