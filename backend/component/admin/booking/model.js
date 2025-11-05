const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    booking_id: { type: String, unique: true, required: true },
    booking_type: {
      type: String,
      enum: ["Regular", "Custom"],
      required: [true, "Booking type is required"],
      default: "Regular",
    },
    cafe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cafe",
      required: [true, "Cafe id is required"],
    },
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "Customer id is required"],
    },
    game_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game",
      required: [true, "Game id is required"],
    },
    slot_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Slot",
      // required: [true, "Slot id is required"],
    },
    slot_date: {
      type: Date,
      required: [true, "Date is required"],
    },
    mode: {
      type: String,
      enum: ["Online", "Offline"],
      required: [true, "Mode is required"],
      default: "Offline",
    },
    status: {
      type: String,
      required: [true, "Status is required"],
    },
    booking_status:{
      type: String,
      enum: ["Confirmed", "Unconfirmed", "Cancelled"],
      // default: "Unconfirmed",
    },
    game_amount: {
      type: Number,
      required: [true, "Game amount is required"],
      default: 0,
    },
    total: {
      type: Number,
      required: [true, "Total is required"],
    },
    paid_amount: {
      type: Number,
      default: 0,
    },
    adjustment: {
      type: Number,
      default: 0,
    },
    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
      },
    ],
    playerCredits: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Customer",
          required: true,
        },
        credit: {
          type: Number,
          required: true,
          min: 0,
        },
        paid_amount: {
          type: Number,
          default: 0,
        },
        txn_id: {
          type: String,
        },
        payment_mode: {
          type: String,
          enum: ["online", "cash", "card", "upi"]
        },
        status: {
          type: String,
          enum: ["Paid", "Unpaid"],
          default: "Unpaid",
        },
        paymentDate: Date,
        updatedAt: Date       // 👈 Add this to track credit updates
      },
    ],
    custom_slot: {
      start_time: {
        type: String,
        match: [/^([0-1]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:mm)'],
      },
      end_time: {
        type: String,
        match: [/^([0-1]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:mm)'],
      },
      slot_price: {
        type: Number,
      },
    },
    looserPlayer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    transaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
      default: null,
    },
    so_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InvSo",
      default: null,
    },
    timer_status: {
      type: String,
      enum: ["Running", "Paused", "Stopped"],
      default: "Stopped",
    },
    start_time: { type: Date, default: null },
    paused_time: { type: Number, default: 0 },
    end_time: { type: Date, default: null },
    total_time: { type: Number, default: 0 },
    commission: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;