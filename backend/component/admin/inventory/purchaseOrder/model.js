const mongoose = require("mongoose");

const invPoSchema = new mongoose.Schema(
  {
    cafe: { type: mongoose.Schema.Types.ObjectId, ref: "Cafe" },
    user_type: {
      type: String,
      enum: ["Vendor", "Superadmin"],
      default: "Superadmin",
    },
    vendor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
    },
    po_no: { type: String, required: true, unique: true },
    refer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InvPo",
      default: null,
    },
    pack_id: [{ type: mongoose.Schema.Types.ObjectId, ref: "InvPo" }],
    ship_id: [{ type: mongoose.Schema.Types.ObjectId, ref: "InvPo" }],
    delivery_type: { type: String },
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    delivery_date: { type: Date, required: false },
    payment_terms: { type: String, required: false },
    reference: { type: String, required: false },
    shipment_preference: { type: String, required: false },
    description: { type: String, required: false },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: "BookItem" }],
    subtotal: { type: Number },
    discount_value: { type: Number, default: 0 },
    discount_type: {
      type: String,
      enum: ["percentage", "flat"],
    },
    tax: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tax", default: null }],
    total: { type: Number },
    adjustment_note: { type: String, required: false },
    adjustment_amount: { type: Number, default: 0 },
    internal_team_notes: { type: String, required: false },
    internal_team_file: { type: Array, required: false },
    status: {
      type: String,
      enum: ["Draft", "Paid", "Partially Paid", "Cancelled", "Received", "Billed", "Packed", "Shipped", "Returned"],
      default: "Draft",
    },
    pending_qty: { type: Number, default: 0 },
    type: { type: String, enum: ["PO", "PB", "PR", "SO", "PACK", "SHIP", "SINV", "RTN"], required: true },
  },
  { timestamps: true }
);

const InvPo = mongoose.model("InvPo", invPoSchema);

module.exports = InvPo;
