const mongoose = require("mongoose");
const validator = require("validator");

const gameSchema = new mongoose.Schema(
  {
    cafe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cafe",
      required: [true, "Cafe is required"],
    },
    name: {
      type: String,
      required: [true, "Game name is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["Single", "Multiplayer"],
      required: [true, "Type is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be a positive number"],
    },
    zone: {
      type: String,
      enum: ["Indoor", "Outdoor"],
      required: [true, "Zone is required"],
      trim: true,
    },
    players: {
      type: Number,
      required: [true, "Players is required"],
      min: [1, "Players must be at least 1"],
    },
    cancellation: {
      type: Boolean,
      required: [true, "Cancellation option is required"],
    },
    gameImage: {
      type: String,
      required: [true, "Game image URL is required"],
    },
    details: {
      type: String,
      trim: true,
    },
    amenities: {
      type: [String],
    },
    commission: {
      type: Number,
      min: [0, "Comission must be a positive number"],
      set: (v) => Math.round(v * 100) / 100,
      default: 0,
    },
    size: {
      type: String,
      required: [true, "Size is required"],
    },
    payLater: {
      type: Boolean,
      required: [true, "Pay later option is required"],
      default: false,
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

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;
