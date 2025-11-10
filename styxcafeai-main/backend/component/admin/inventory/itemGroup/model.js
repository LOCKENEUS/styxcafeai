const mongoose = require("mongoose");

const itemGroupSchema = new mongoose.Schema(
  {
    user_type: { type: String, enum: ["superadmin", "cafe"], default: "cafe" },
    cafe: { type: mongoose.Schema.Types.ObjectId, ref: "Cafe" },
    superadmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    group_name: { type: String, required: true },
    description: { type: String },
    unit: { type: String, required: true },
    taxable: { type: Boolean, default: false },
    tax: { type: mongoose.Schema.Types.ObjectId, ref: "Tax", default: null },
    manufacturer: { type: mongoose.Schema.Types.ObjectId, ref: "CustomField", default: null },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "CustomField", default: null },
    attributes: { type: Object },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }],
  },
  { timestamps: true }
);

const ItemGroup = mongoose.model("ItemGroup", itemGroupSchema);

module.exports = ItemGroup;
