const express = require("express");
const Router = express.Router();
const cors = require("cors");
const { getCounts, getDashboardData } = require("./controller");
const saAuth = require("../../../middleware/saAuth");

Router.get("/", getCounts);
Router.get("/data", saAuth, getDashboardData);

module.exports = Router;