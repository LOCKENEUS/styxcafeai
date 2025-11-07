const express = require("express");
const Router = express.Router();
const upload = require("../../../middleware/imageUpload");
const cors = require("cors");
const { createCustomer, getCustomerById, updateCustomer, deleteCustomer, getAllCustomers, searchCustomers, collectCreditAmount, collectCreditOnline, partialCollectCreditAmount, collectPartialCreditOnline } = require("./controller");
const auth = require("../../../middleware/auth");

Router.route("/").post(auth, upload.single("customerProfile"), createCustomer);
Router.route("/:id")
  .get(auth, getCustomerById)
  .put(auth, upload.single("customerProfile"), updateCustomer)
  .delete(auth, deleteCustomer);
  
Router.route("/list/:id").get(auth, getAllCustomers);

Router.route("/search/:id").get(auth, searchCustomers);

// Credit Collection
Router.route("/collect-amount/:id").patch(auth, collectCreditAmount);
Router.route("/collect-online/:id").patch(auth, collectCreditOnline);

Router.route("/custom-credit-amount/:id").patch(auth, partialCollectCreditAmount);
Router.route("/custom-credit-online/:id").patch(auth, collectPartialCreditOnline);

module.exports = Router;
