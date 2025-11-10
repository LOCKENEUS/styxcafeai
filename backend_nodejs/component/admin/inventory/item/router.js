const express = require("express");
const Router = express.Router();
const upload = require("../../../../middleware/imageUpload");
const cors = require("cors");
const { createItem, getItemById, updateItem, deleteItem, getItems, getTransactionsAndHistory } = require("./controller");
const auth = require("../../../../middleware/auth");

Router.route("/").post(auth, upload.single("image"), createItem);
Router.route("/:id")
  .get(auth, getItemById)
  .put(auth, upload.single("image"), updateItem)
  .delete(auth, deleteItem);
  
Router.route("/list/:id").get(auth, getItems);

Router.route("/transactions/:id").get(auth, getTransactionsAndHistory);

module.exports = Router;
