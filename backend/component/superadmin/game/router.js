const express = require("express");
const Router = express.Router();
const upload = require("../../../middleware/imageUpload");
const cors = require("cors");
const {
  createGame,
  getGame,
  updateGame,
  deleteGame,
  getGames,
  getGameOrGames,
  getGameCommissions,
} = require("./controller");

Router.route("/").post(upload.single("gameImage"), createGame);
// Router.route("/:id")
//   // .get(getGame)
//   .patch(upload.single("gameImage"), updateGame)
//   .delete(deleteGame);

// Router.route("/:id").get(getGames);
// Router.route("/view/:id").get(getGame);

Router.route("/:id")
  .get(getGameOrGames) // Handles both single game and multiple games
  .patch(upload.single("gameImage"), updateGame)
  .delete(deleteGame);

Router.route("/commission/:id").post(getGameCommissions);

module.exports = Router;
