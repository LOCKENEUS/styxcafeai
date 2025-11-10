const mongoose = require("mongoose");
const validator = require("validator");

const staffMemberSchema = new mongoose.Schema(
  {
    cafe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cafe",
      required: [true, "Cafe is required"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      trim: true,
    },
    contact_no: {
      type: String,
      required: [true, "Contact number is required"],
      trim: true,
    },
    age: {
      type: String,
      required: [true, "Age is required"],
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: [true, "Gender is required"],
      trim: true,
    },
    userProfile: {
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

const StaffMember = mongoose.model("StaffMember", staffMemberSchema);

module.exports = StaffMember;
