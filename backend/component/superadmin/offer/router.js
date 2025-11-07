const express = require("express");
const Router = express.Router();
const cors = require("cors");
const { createOffer, getOfferDetails, updateOffer, getOffers, deleteOffer } = require("./controller");

Router.route("/").post(createOffer);

Router.route("/:id")
  .get(getOfferDetails)
  .put(updateOffer)
  .delete(deleteOffer);
  
Router.route("/list/:id").get(getOffers);

module.exports = Router;
