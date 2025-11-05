const mongoose = require('mongoose');
const validator = require('validator');

const membershipSchema = new mongoose.Schema(
  {
    cafe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cafe",
      required: [true, "Cafe is required"],
    },
    name: {
      type: String,
      required: [true, 'Membership name is required'],
      trim: true,
    },
    details: {
      type: [String],
      required: [true, "Details are required"],
      validate: {
        validator: (value) => value.length > 0,
        message: "At least one detail is required",
      },
    },
    validity: {
      type: String,
      enum: ["Weekly", "Monthly", "Quarterly", "Yearly", "3 Months" ],
      required: [true, "Validity is required"],
      trim: true,
    },
    limit: {
      type: Number,
      required: [true, 'Limit is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      trim: true,
    },
    is_active: {
      type: Boolean,
      default: true
    },
    is_deleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

const Membership = mongoose.model('Membership', membershipSchema);

module.exports = Membership;