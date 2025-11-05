const express = require("express");
const Router = express.Router();
const { createSaItemGroup } = require("./controller");
const saAuth = require("../../../../middleware/saAuth");
const { getSaItemGroupList } = require("./controller");
const { updateSaItemGroup } = require("./controller");
const { getSaItemGroupById } = require("./controller");

Router.route("/").post(saAuth, createSaItemGroup);

Router.route("/list").get(saAuth, getSaItemGroupList);

Router.route("/:id")
  .get(saAuth, getSaItemGroupById)
  .put(saAuth, updateSaItemGroup)
  
// Router.route("/list/:id").get(auth, getItemGroupList);

module.exports = Router;
