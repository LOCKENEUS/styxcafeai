const express = require("express");
const Router = express.Router();
const upload = require("../../../middleware/imageUpload");
const cors = require("cors");
const {
  createCafe,
  getCafeById,
  updateCafe,
  getAllCafes,
  deleteCafe,
  resetPassword,
} = require("./controller");

Router.route("/").post(
  upload.fields([
    { name: "cafeImage", maxCount: 6 },
    { name: "document", maxCount: 5 },
    {name: "cafeLogo", maxCount: 1},
  ]),
  createCafe
);

Router.route("/:id")
  .get(getCafeById)
  .put(
    upload.fields([
      { name: "cafeImage", maxCount: 6 },
      { name: "document", maxCount: 5 },
      {name: "cafeLogo", maxCount: 1},
    ]),
    updateCafe
  )
  .delete(deleteCafe);

Router.route("/").get(getAllCafes);

Router.route("/reset-password").post(resetPassword);


module.exports = Router;