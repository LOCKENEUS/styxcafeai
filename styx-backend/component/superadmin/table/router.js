const express = require("express");
const Router = express.Router();
const cors = require("cors");
const { createTable, getTableDetails, updateTable, deleteTable, getTables } = require("./controller");

Router.route("/").post(createTable);

Router.route("/:id")
  .get(getTableDetails)
  .patch(updateTable)
  .delete(deleteTable);
  
Router.route("/").get(getTables);

module.exports = Router;
