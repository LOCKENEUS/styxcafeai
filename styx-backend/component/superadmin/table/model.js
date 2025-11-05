const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema(
  {
    game_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game",
      required: [true, 'Game id is required'],
    },
    size: {
      type: Number,
      required: [true, 'Size is required'],
    },
    availability: {
      type: Boolean,
      required: [true, 'Availability is required'],
    }
  },
  {
    timestamps: true,
  }
);

const Table = mongoose.model('Table', tableSchema);

module.exports = Table;
