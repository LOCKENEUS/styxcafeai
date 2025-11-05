const express = require("express");
const Router = express.Router();
const upload = require("../../../../middleware/imageUpload");
const { createItem, getItemById, updateItem, deleteItem, getItems, getTransactionsAndHistory } = require("./controller");
const saAuth = require("../../../../middleware/saAuth");

Router.route("/").post(saAuth, upload.single("image"), createItem);

Router.route("/list").get(getItems);

Router.route("/:id")
  .get(saAuth, getItemById)
  .put(saAuth, upload.single("image"), updateItem)
  .delete(saAuth, deleteItem);

Router.route("/transactions/:id").get(saAuth, getTransactionsAndHistory);
  
module.exports = Router;