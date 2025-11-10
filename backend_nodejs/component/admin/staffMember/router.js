const express = require("express");
const Router = express.Router();
const upload = require("../../../middleware/imageUpload");
const cors = require("cors");
const { createStaffMember, getStaffMemberById, updateStaffMember, deleteStaffMember, getAllStaffMembers } = require("./controller");
const auth = require("../../../middleware/auth");

Router.route("/").post(auth, upload.single("userProfile"), createStaffMember);
Router.route("/:id")
  .get(auth, getStaffMemberById)
  .put(auth, upload.single("userProfile"), updateStaffMember)
  .delete(auth, deleteStaffMember);
  
Router.route("/list/:id").get(auth, getAllStaffMembers);

module.exports = Router;