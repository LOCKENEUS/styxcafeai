const express = require("express");
const Router = express.Router();
const upload = require("../../../middleware/imageUpload");
const {
  createHeroContent,
  getAllHeroContent,
  getActiveHeroContent,
  updateHeroContent,
  deleteHeroContent,
  createServiceContent,
  getAllServiceContent,
  getActiveServiceContent,
  updateServiceContent,
  deleteServiceContent,
} = require("./controller");

// Hero Content Routes
Router.route("/hero")
  .get(getAllHeroContent)
  .post(upload.single("backgroundImage"), createHeroContent);

Router.route("/hero/active").get(getActiveHeroContent);

Router.route("/hero/:id")
  .put(upload.single("backgroundImage"), updateHeroContent)
  .delete(deleteHeroContent);

// Service Content Routes
Router.route("/service")
  .get(getAllServiceContent)
  .post(upload.single("image"), createServiceContent);

Router.route("/service/active").get(getActiveServiceContent);

Router.route("/service/:id")
  .put(upload.single("image"), updateServiceContent)
  .delete(deleteServiceContent);

module.exports = Router;
