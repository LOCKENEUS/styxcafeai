const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    payment_id: {
      type: String,
      required: [true, 'Payment id is required'],
    },
    booking_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: [true, 'Booking id is required'],
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, 'User id is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
    },
    method: {
      type: String,
      required: [true, 'Method time is required'],
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

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
