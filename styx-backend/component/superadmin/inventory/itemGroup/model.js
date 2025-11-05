const mongoose = require("mongoose");

const saItemGroupSchema = new mongoose.Schema(
  {
    group_name: { type: String, required: true },
    description: { type: String },
    unit: { type: String, required: true },
    taxable: { type: Boolean, default: false },
    tax: { type: mongoose.Schema.Types.ObjectId, ref: "Tax", default: null },
    manufacturer: { type: mongoose.Schema.Types.ObjectId, ref: "CustomField", default: null },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "CustomField", default: null },
    attributes: { type: Object },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: "SaItem" }],
  },
  { timestamps: true }
);

const SaItemGroup = mongoose.model("SaItemGroup", saItemGroupSchema);

module.exports = SaItemGroup;
