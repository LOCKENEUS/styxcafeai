const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    userType : {
      type: String,
      enum: ["cafe", "superadmin"],
      default: "cafe",
    },
    name: {
      type: String,
      required: [true, "Vendor name is required"],
      trim: true,
    },
    emailID: {
      type: String,
      required: false, // Email is optional for vendors
      trim: true,
      lowercase: true,
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    billingAddress: {
      type: String,
    },
    shippingAddress: {
      type: String,
    },
    country1: String,
    country2: String,
    state1: String,
    state2: String,
    city1: String,
    city2: String,
    pincode1: Number,
    pincode2: Number,
    latitude1: { type: Number, default: 0 },
    longitude1: { type: Number, default: 0 },
    latitude2: Number,
    longitude2: Number,
    govtId: {
      type: String,
    },
    documents: String,
    bank_name: String,
    accountNo: {
      type: Number,
    },
    ifsc: String,
    accountType: String,
    cafe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cafe",
    },
    image: String,
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

// Unique index on emailID and cafe, but only when emailID exists
// This allows multiple vendors with no email (null) for different cafes or superadmin
vendorSchema.index(
  { emailID: 1, cafe: 1 }, 
  { 
    unique: true,
    partialFilterExpression: { 
      emailID: { $exists: true, $ne: null, $ne: '' } 
    }
  }
);

const Vendor = mongoose.model("Vendor", vendorSchema);

module.exports = Vendor;
