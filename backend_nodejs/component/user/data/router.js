const express = require("express");
const Router = express.Router();
const cors = require("cors");
const { getCafeDetails, getGameDetails, getCafesByFilter, getLocations, getFilteredCafes, getProfileDetails, updateProfileDetails, getCafeItems, getRecentCafes } = require("./controller");
const userAuth = require("../../../middleware/userAuth");
const upload = require("../../../middleware/imageUpload");

Router.route("/cafeDetails/:id").get(getCafeDetails);
Router.route("/gameDetails/:id").get(getGameDetails);
Router.route("/cafesByFilter").post(getCafesByFilter);
Router.route("/filterCafes").post(getFilteredCafes);
Router.route("/locations").get(getLocations);
Router.route("/profile").get(userAuth, getProfileDetails);
Router.route("/profile").put(userAuth, upload.single("customerProfile"), updateProfileDetails);
Router.route("/cafe/items/:id").get(getCafeItems);
Router.route("/recent-cafe").get(getRecentCafes);
Router.route("/recent-cafe").post(getRecentCafes);

module.exports = Router;