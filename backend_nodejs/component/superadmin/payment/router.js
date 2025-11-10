const express = require("express");
const Router = express.Router();
const cors = require("cors");
const { createPayment, getPaymentDetails, updatePayment, deletePayment, getPayments } = require("./controller");

Router.route("/").post(createPayment);

Router.route("/:id")
  .get(getPaymentDetails)
  .patch(updatePayment)
  .delete(deletePayment);
  
Router.route("/").get(getPayments);

module.exports = Router;
