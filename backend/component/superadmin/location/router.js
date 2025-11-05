const express = require("express");
const Router = express.Router();
const upload = require("../../../middleware/imageUpload");
const cors = require("cors");
const { createLocation, getLocation, updateLocation, deleteLocation, getLocations } = require("./controller");

Router.route("/").post(upload.single("locationImage"), createLocation);
Router.route("/:id")
  .get(getLocation)
  .patch(upload.single("locationImage"), updateLocation)
  .delete(deleteLocation);
  
Router.route("/").get(getLocations);

module.exports = Router;