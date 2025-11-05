const express = require("express");
const Router = express.Router();
const cors = require("cors");
const upload = require("../../../../middleware/imageUpload");

const { createVendor, getVendorById, updateVendor, deleteVendor, getVendors } = require("./controller");
const saAuth = require("../../../../middleware/saAuth");

Router.route("/").post( saAuth, upload.single("image"),createVendor);
Router.route("/list").get( saAuth, getVendors);

Router.route("/:id")
  .get( saAuth, getVendorById)
  .put( saAuth, upload.single("image"),updateVendor)
  .delete( saAuth, deleteVendor);
  
module.exports = Router;
