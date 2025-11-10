// auth/index.js
const express = require("express");
const router = express.Router();

// Import routers from each subfolder
const userRouter = require("./auth/router/router");
const cafeSignupRouter = require("./cafe-signup/router");

// Use the routers
router.use("/", userRouter);
router.use("/", cafeSignupRouter);

module.exports = router;