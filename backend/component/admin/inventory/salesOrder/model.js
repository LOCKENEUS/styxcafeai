const mongoose = require("mongoose");

const invSoSchema = new mongoose.Schema(
  {
    cafe: { type: mongoose.Schema.Types.ObjectId, ref: "Cafe", required: true },
    so_no: { type: String, required: true, unique: true },
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: false,
    },
    refer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: false,
    },
    date: { type: Date, required: false },
    payment_terms: { type: String, required: false },
    reference: { type: String, required: false },
    sales_person: { type: String, required: false },
    description: { type: String, required: false },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: "BookItem" }],
    subtotal: { type: Number, required: true },
    discount_value: { type: Number, default: 0 },
    discount_type: {
      type: String,
      enum: ["percentage", "flat"],
      required: false,
    },
    tax: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tax", default: null }],
    total: { type: Number, required: true },
    adjustment_note: { type: String, required: false },
    adjustment_amount: { type: Number, default: 0 },
    deposit_amount: { type: Number, default: 0 },
    internal_team_notes: { type: String, required: false },
    pending_qty: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Draft", "Received"],
      default: "Draft",
    },
    type: { type: String, enum: ["SO", "SI"], required: true },
    payment_status: {
      type: String,
      enum: ["Pending", "Partially Paid", "Paid"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const InvSo = mongoose.model("InvSo", invSoSchema);

module.exports = InvSo;
