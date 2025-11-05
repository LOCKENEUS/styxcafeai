const express = require("express");
const Router = express.Router();
const cors = require("cors");
const { createItemGroup, getItemGroupList, getItemGroupById, updateItemGroup } = require("./controller");
const auth = require("../../../../middleware/auth");

Router.route("/").post(auth, createItemGroup);
Router.route("/:id")
  .get(auth, getItemGroupById)
  .put(auth, updateItemGroup)
//   .delete(deleteItem);
  
Router.route("/list/:id").get(auth, getItemGroupList);

module.exports = Router;
