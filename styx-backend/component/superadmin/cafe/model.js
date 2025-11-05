const mongoose = require("mongoose");
const validator = require("validator");

const cafeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    contact_no: {
      type: String,
      required: [true, "Contact number is required"],
      trim: true,
    },
    cafe_name: {
      type: String,
      required: [true, "Cafe name is required"],
      trim: true,
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: [true, "Location is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    website_url: {
      type: String,
      trim: true,
    },
    cafeImage: {
      type: [String],
      default: [],
    },
    password: {
      type: String,
      select: false,
    },
    gstNo: {
      type: String,
      trim: true,
    },
    panNo: {
      type: String,
      trim: true,
    },
    ownershipType: {
      type: String,
      enum: ["FOFO", "FOCO"],
      required: [true, "Ownership type is required"],
      trim: true,
    },
    depositAmount: {
      type: Number,
    },
    document: {
      type: [String],
      default: [],
    },
    yearsOfContract: {
      type: Number,
    },
    officeContactNo: {
      type: String,
      trim: true,
    },  
    is_active: {
      type: Boolean,
      default: true,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      trim: true,
    },
    cafeLogo:{
      type: String,
      trim: true,
    },
    resetOTP: {
      type: String,
      select: false,
    },
    otpExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

const Cafe = mongoose.model("Cafe", cafeSchema);

module.exports = Cafe;
