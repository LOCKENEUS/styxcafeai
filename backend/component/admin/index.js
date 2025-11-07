const express = require("express");
const router = express.Router();

const customerRouter = require("./customer/router");
const inventoryRouter = require("./inventory/router");
const staffMemberRouter = require("./staffMember/router");
const booingsRouter = require("./booking/router");
const dashboardRouter = require("./dashboard/router");
const reportsRouter = require("./reports/router");

router.use("/customer", customerRouter);
router.use("/inventory", inventoryRouter);
router.use("/staff-member", staffMemberRouter);
router.use("/booking", booingsRouter);
router.use("/dashboard", dashboardRouter);
router.use("/reports", reportsRouter);

module.exports = router;