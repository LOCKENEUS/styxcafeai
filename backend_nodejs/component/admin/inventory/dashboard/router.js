const express = require("express");
const Router = express.Router();
const cors = require("cors");
const { getDashboardData } = require("./controller");
const auth = require("../../../../middleware/auth");

Router.route("/").get(auth, getDashboardData);

module.exports = Router;