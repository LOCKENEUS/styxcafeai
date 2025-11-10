const express = require("express");
const Router = express.Router();
const cors = require("cors");
const {
  createBooking,
  getBookingDetails,
  updateBooking,
  deleteBooking,
  getBookings,
  payment,
  verifyPayment,
  getBookingsByGame,
  startBookingTimer,
  pauseBookingTimer,
  resumeBookingTimer,
  stopBookingTimer,
  getBookingsBySlotDate,
  addToCart,
  generateReport,
} = require("./controller");
const auth = require("../../../middleware/auth");

Router.route("/").post(auth,createBooking);

Router.route("/:id")
  .get(auth,getBookingDetails)
  .put(auth,updateBooking)
  .delete(auth,deleteBooking);

Router.route("/list/:id").get(auth,getBookings);
Router.route("/add-to-cart/:id").post(auth,addToCart);
Router.route("/game/:id").get(auth,getBookingsByGame);

Router.route("/payment").post(auth,payment);
Router.route("/verify-payment").post(auth,verifyPayment);

Router.route("/start-timer/:id").put(auth,startBookingTimer);
Router.route("/pause-timer/:id").put(auth,pauseBookingTimer);
Router.route("/resume-timer/:id").put(auth,resumeBookingTimer);
Router.route("/stop-timer/:id").put(auth,stopBookingTimer);

Router.route("/list/:cafeId/:slotDate").get(auth,getBookingsBySlotDate);

Router.route("/report").post(auth,generateReport)

module.exports = Router;
