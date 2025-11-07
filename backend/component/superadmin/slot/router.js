const express = require("express");
const Router = express.Router();
const cors = require("cors");
const { createSlot, getSlotDetails, updateSlot, deleteSlot, getSlots, getSlots24hour, copySlotsToRemainingDays } = require("./controller");

Router.route("/").post(createSlot);
Router.route("/copy/:game_id/:day").post(copySlotsToRemainingDays);

Router.route("/:id")
  .get(getSlotDetails)
  .patch(updateSlot)
  .delete(deleteSlot);
  
Router.route("/list/:id").get(getSlots);
Router.route("/list24/:id").get(getSlots24hour);

module.exports = Router;
