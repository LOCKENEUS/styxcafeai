const mongoose = require("mongoose");

const heroContentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
    },
    description: {
      type: String,
    },
    backgroundImage: {
      type: String,
    },
    buttonText: {
      type: String,
      default: "Book Now",
    },
    buttonLink: {
      type: String,
      default: "/booking",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HeroContent", heroContentSchema);
