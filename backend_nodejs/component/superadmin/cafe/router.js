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

// Multer error handler middleware
const handleMulterError = (err, req, res, next) => {
  if (err) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        status: false,
        message: 'File too large. Maximum file size is 10MB per file.',
      });
    }
    if (err.message.includes('Only image')) {
      return res.status(400).json({
        status: false,
        message: err.message,
      });
    }
    return res.status(400).json({
      status: false,
      message: err.message || 'File upload error',
    });
  }
  next();
};

Router.route("/").post(
  upload.fields([
    { name: "cafeImage", maxCount: 6 },
    { name: "document", maxCount: 5 },
    {name: "cafeLogo", maxCount: 1},
  ]),
  handleMulterError,
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
    handleMulterError,
    updateCafe
  )
  .delete(deleteCafe);

Router.route("/").get(getAllCafes);

Router.route("/reset-password").post(resetPassword);


module.exports = Router;