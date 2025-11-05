const express = require("express");
const Router = express.Router();
const cors = require("cors");
const { generateReport, getBookingsReport, getCommissionReport } = require("./controller");
const auth = require("../../../middleware/auth");

Router.route("/:id").post(auth, generateReport);
Router.route("/bookings/data").post(auth, getBookingsReport);
Router.route("/commission/data").post(auth, getCommissionReport);

module.exports = Router;