const express = require("express");
const router = express.Router();

const taxRouter = require("./tax/router");
const customFieldRouter = require("./customField/router");
const vendorRouter = require("./vendor/router");
const itemRouter = require("./item/router");
const itemGroupRouter = require("./itemGroup/router");
const poRouter = require("./purchaseOrder/router");
const soRouter = require("./salesOrder/router");
const dashboardRouter = require("./dashboard/router");

router.use("/tax", taxRouter);
router.use("/custom-field", customFieldRouter);
router.use("/vendor", vendorRouter);
router.use("/item", itemRouter);
router.use("/item-group", itemGroupRouter);
router.use("/po", poRouter);
router.use("/so", soRouter);
router.use("/dashboard", dashboardRouter);

module.exports = router;