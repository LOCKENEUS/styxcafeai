const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema(
  {
    game_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game",
      required: [true, 'Game id is required'],
    },
    start_time: {
      type: String,
      required: [true, 'Start time is required'],
      match: [/^([0-1]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:mm)'],
    },
    end_time: {
      type: String,
      required: [true, 'End time is required'],
      match: [/^([0-1]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:mm)'],
    },
    availability: {
      type: Boolean,
      default: true,
    },
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    slot_price: {
      type: Number,
    },
    slot_name: {
      type: String,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
    players:{
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
  }
);

const Slot = mongoose.model('Slot', slotSchema);

module.exports = Slot;
