const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    booking_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
    razorpay_order_id: { type: String, required: true },
    razorpay_payment_id: { type: String, required: true },
    razorpay_signature: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: {
      type: String,
      enum: ["Success", "Failed"],
      default: "Success",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);