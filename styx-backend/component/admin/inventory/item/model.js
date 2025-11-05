const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    cafe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cafe"
    },
    referId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
    },
    sku: {
      type: String,
      trim: true,
    },
    unit: {
      type: String,
      required: [true, "Unit is required"],
      trim: true,
    },
    hsn: {
      type: Number,
      default: 0,
    },
    taxable: {
      type: Boolean,
      default: false,
    },
    tax: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tax",
      default: null,
    },
    length: {
      type: Number,
      default: 0,
    },
    width: {
      type: Number,
      default: 0,
    },
    height: {
      type: Number,
      default: 0,
    },
    dimensionUnit: {
      type: String,
      trim: true,
    },
    weight: {
      type: Number,
      default: 0,
    },
    weightUnit: {
      type: String,
      trim: true,
    },
    manufacturer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CustomField",
      default: null,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CustomField",
      default: null,
    },
    mpn: {
      type: String,
      trim: true,
    },
    upc: {
      type: String,
      trim: true,
    },
    ean: {
      type: String,
      trim: true,
    },
    isbn: {
      type: String,
      trim: true,
    },
    costPrice: {
      type: Number,
      required: [true, "Cost price is required"],
      default: 0,
    },
    sellingPrice: {
      type: Number,
      default: 0,
    },
    cafeSellingPrice: {
      type: Number,
      default: 0,
    },
    preferredVendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      default: null,
    },
    stock: {
      type: Number,
      default: 0,
    },
    stockRate: {
      type: Number,
      default: 0,
    },
    reorderPoint: {
      type: Number,
      default: 0,
    },
    image: {
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

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
