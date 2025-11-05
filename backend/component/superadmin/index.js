// superadmin/index.js
const express = require("express");
const router = express.Router();

// Import routers from each subfolder
const locationRouter = require("./location/router");
const cafeRouter = require("./cafe/router");
const gameRouter = require("./game/router");
const slotRouter = require("./slot/router");
const bookingRouter = require("../admin/booking/router");
const paymentRouter = require("./payment/router");
const tableRouter = require("./table/router");
const offerRouter = require("./offer/router");
const membershipRouter = require("./membership/router");
const dashboardRouter = require("./dashboard/router");
const inventoryRouter = require("./inventory/router");

// Use the routers
router.use("/location", locationRouter);
router.use("/cafe", cafeRouter);
router.use("/game", gameRouter);
router.use("/slot", slotRouter);
router.use("/payment", paymentRouter);
router.use("/table", tableRouter);
router.use("/offer", offerRouter);
router.use("/membership", membershipRouter);
router.use("/dashboard", dashboardRouter);
router.use("/inventory", inventoryRouter);

module.exports = router;