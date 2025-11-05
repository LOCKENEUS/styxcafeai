const mongoose = require("mongoose");

const billPaymentSchema = new mongoose.Schema(
  {
    cafe: { type: mongoose.Schema.Types.ObjectId, ref: "Cafe" },
    bill_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InvPo",
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

const BillPayment = mongoose.model("BillPayment", billPaymentSchema);

module.exports = BillPayment;
