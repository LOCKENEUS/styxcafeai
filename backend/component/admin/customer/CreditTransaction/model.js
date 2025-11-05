const mongoose = require("mongoose");

const creditTransactionSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "Customer is required"],
    },
    bookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
      },
    ],
    amount: {
      type: Number,
      trim: true,
    },
    mode: {
      type: String,
      enum: ["Online", "Cash"],
      default: "Cash",
    },
    txn_id: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const CreditTransaction = mongoose.model( "CreditTransaction", creditTransactionSchema );

module.exports = CreditTransaction;
