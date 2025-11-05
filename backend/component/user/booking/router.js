const express = require("express");
const Router = express.Router();
const cors = require("cors");
const auth = require("../../../middleware/userAuth");
const { createBooking, getBookingDetails, getBookingList, payment, verifyPayment, getCompletedBookingList, getUpcomingBookingList, getOngoingBookingList, getGameBookings } = require("./controller");

Router.route("/create").post(createBooking);
Router.route("/details/:id").get(auth, getBookingDetails);
Router.route("/list").get(auth, getBookingList);
Router.route("/list/completed").get(auth, getCompletedBookingList);
Router.route("/list/upcoming").get(auth, getUpcomingBookingList);
Router.route("/list/ongoing").get(auth, getOngoingBookingList);
Router.route("/list/game/:id").get(getGameBookings);

// Payment Routes
Router.route("/payment").post( payment);
Router.route("/payment/verify").post(verifyPayment);

module.exports = Router;