const express = require("express");
const Router = express.Router();
const cors = require("cors");
const { createTax, getTaxById, updateTax, deleteTax, getTaxes } = require("./controller");

Router.route("/").post(createTax);
Router.route("/:id")
  .get(getTaxById)
  .put(updateTax)
  .delete(deleteTax);
  
Router.route("/list/:id").get(getTaxes);

module.exports = Router;
