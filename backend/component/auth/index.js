// superadmin/index.js
const express = require("express");
const router = express.Router();

// Import routers from each subfolder
const userRouter = require("./auth/router/router");

// Use the routers
router.use("/", userRouter);

module.exports = router;