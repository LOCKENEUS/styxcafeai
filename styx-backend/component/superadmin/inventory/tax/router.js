const express = require("express");
const Router = express.Router();
const cors = require("cors");
const { createTax, getTaxById, updateTax, deleteTax, getTaxes } = require("./controller");
const saAuth = require("../../../../middleware/saAuth");

Router.route("/").post(saAuth, createTax);
Router.route("/list").get(saAuth, getTaxes);
Router.route("/:id")
  .get(saAuth, getTaxById)
  .put(saAuth, updateTax)
  .delete(saAuth, deleteTax);

module.exports = Router;
