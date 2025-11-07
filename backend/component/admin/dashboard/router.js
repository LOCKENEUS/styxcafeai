const express = require("express");
const Router = express.Router();
const upload = require("../../../middleware/imageUpload");
const { getAdminDashboardData, getSearchData } = require("./controller");
const auth = require("../../../middleware/auth");

Router.route("/").get(auth, getAdminDashboardData);
Router.route("/search").get(auth, getSearchData);

module.exports = Router;