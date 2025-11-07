const mongoose = require("mongoose");

const taxSchema = new mongoose.Schema(
  {
    tax_name: {
      type: String,
      required: [true, "Tax name is required"],
      trim: true,
    },
    tax_rate: {
      type: Number,
      required: [true, "Tax rate is required"],
      min: [0, "Tax rate cannot be negative"],
    },
    description: {
      type: String,
      trim: true,
    },
    cafe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cafe",
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

const Tax = mongoose.model("Tax", taxSchema);

module.exports = Tax;
