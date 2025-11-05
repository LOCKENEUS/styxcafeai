const mongoose = require("mongoose");
const validator = require("validator");

const customerSchema = new mongoose.Schema(
  {
    cafe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cafe",
      required: [true, "Cafe is required"],
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location"
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    contact_no: {
      type: String,
      required: [true, "Contact number is required"],
      trim: true,
    },
    age: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", "N/A"],
      // required: [true, "Gender is required"],
      default: "N/A",
      trim: true,
    },
    customerProfile: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
    },
    creditEligibility: {
      type: String,
      enum: ["Yes", "No"],
      default: "No",
      trim: true,
    },
    creditLimit:{
      type:Number,
      default: 0     
    },
    creditAmount:{
      type:Number,
      default: 0
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
