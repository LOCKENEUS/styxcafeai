const express = require("express");
const Router = express.Router();
const cors = require("cors");
const upload = require("../../../../middleware/imageUpload");

const { createVendor, getVendorById, updateVendor, deleteVendor, getVendors } = require("./controller");
const auth = require("../../../../middleware/auth");

Router.route("/").post( auth, upload.single("image"),createVendor);
Router.route("/:id")
  .get( auth, getVendorById)
  .put( auth, upload.single("image"),updateVendor)
  .delete( auth, deleteVendor);
  
Router.route("/list/:id").get( auth, getVendors);

module.exports = Router;
