const mongoose = require("mongoose");

const invPaymentSchema = new mongoose.Schema(
  {
    cafe: { type: mongoose.Schema.Types.ObjectId, ref: "Cafe", required: true },
    invoice_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InvSo",
      required: true,
    },
    deposit_amount: { type: Number, default: 0 },
    mode: {
      type: String,
    },
    deposit_date: { type: Date },
    transaction_id: { type: String },
    description: { type: String },
  },
  { timestamps: true }
);

const InvPayment = mongoose.model("InvPayment", invPaymentSchema);

module.exports = InvPayment;
