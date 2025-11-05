const mongoose = require("mongoose");

const customFieldSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    cafe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cafe",
    },
    type: {
      type: String,
      enum: ["Manufacturer", "Brand", "Unit", "Payment Terms"],
      required: [true, "Type is required"],
      trim: true,
    },
    code: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
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

const CustomField = mongoose.model("CustomField", customFieldSchema);

module.exports = CustomField;
