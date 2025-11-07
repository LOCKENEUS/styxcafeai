const express = require("express");
const Router = express.Router();
const cors = require("cors");
const {
  getMembership,
  updateMembership,
  deleteMembership,
  getMemberships,
  createMembership,
} = require("./controller");

Router.route("/").post(createMembership);
Router.route("/:id")
  .get(getMembership)
  .patch(updateMembership)
  .delete(deleteMembership);

Router.route("/list/:id").get(getMemberships);

module.exports = Router;
