const express = require("express");
const Router = express.Router();
const cors = require("cors");
const { createCustomField, getCustomFields, updateCustomField, deleteCustomField, getCustomFieldById } = require("./controller");

Router.route("/").post(createCustomField);
Router.route("/:id")
  .get(getCustomFieldById)
  .put(updateCustomField)
  .delete(deleteCustomField);
  
Router.route("/list/:id").get(getCustomFields);

module.exports = Router;
