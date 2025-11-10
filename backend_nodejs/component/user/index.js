const express = require("express");
const router = express.Router();

const booingsRouter = require("./booking/router");
const generalRouter = require("./data/router");

router.use("/booking", booingsRouter);
router.use("/", generalRouter);

module.exports = router;