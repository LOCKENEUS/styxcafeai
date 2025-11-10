const express = require("express");
const Router = express.Router();
const cors = require("cors");
const { createPayment, getPaymentList, getPaymentListByInvoice } = require("./controller");

// Sales Order
Router.route("/").post(createPayment);

Router.route("/list").get(getPaymentList);
Router.route("/invoice-payments/:id").get(getPaymentListByInvoice);

module.exports = Router;