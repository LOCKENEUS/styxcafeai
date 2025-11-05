const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    cafe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cafe",
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    coupon_code: {
      type: String,
      required: [true, "Coupon code is required"],
    },
    type: {
      type: String,
      required: [true, "Type is required"],
      enum: ["on date", "on game", "on amount"],
    },
    from_datetime: {
      type: Date,
    },
    to_datetime: {
      type: Date,
    },
    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game",
    },
    min_amount: {
      type: Number,
    },
    max_amount: {
      type: Number,
    },
    discount: {
      type: Number,
      required: [true, "Discount is required"],
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

const Offer = mongoose.model("Offer", offerSchema);
module.exports = Offer;
