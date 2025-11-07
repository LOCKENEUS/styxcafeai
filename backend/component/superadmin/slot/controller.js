const Slot = require("./model");
const { formatTimestamps } = require("../../../utils/utils");

const createSlot = async (req, res) => {
  try {
    const {
      game_id,
      start_time,
      end_time,
      availability,
      day,
      slot_price,
      slot_name,
      players
    } = req.body;

    // Check if a slot already exists for this game_id, day, and overlapping time range
    const existingSlot = await Slot.findOne({
      game_id,
      day,
      $or: [
        { start_time: { $lt: end_time }, end_time: { $gt: start_time } }, // Overlapping condition
      ],
    });

    if (existingSlot) {
      return res.status(400).json({
        status: false,
        message:
          "A slot already exists within this time range for the selected day.",
      });
    }

    // Create new slot if no overlapping slot is found
    const newSlot = await Slot.create({
      game_id,
      start_time,
      end_time,
      availability,
      day,
      slot_price,
      slot_name,
      players
    });

    res.status(201).json({
      status: true,
      message: "Slot created successfully",
      data: newSlot,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

const copySlotsToRemainingDays = async (req, res) => {
  try {
    const { game_id, day } = req.params;

    const weekDays = [
      'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
    ];

    const remainingDays = weekDays.filter(d => d !== day);

    // Get all slots for the provided game_id and day
    const sourceSlots = await Slot.find({ game_id, day });

    if (sourceSlots.length === 0) {
      return res.status(404).json({
        status: false,
        message: `No slots found on ${day} for the given game.`,
      });
    }

    const createdSlots = [];
    const skippedSlots = [];

    for (const targetDay of remainingDays) {
      for (const slot of sourceSlots) {
        const { start_time, end_time } = slot;

        const overlappingSlot = await Slot.findOne({
          game_id,
          day: targetDay,
          $or: [
            {
              start_time: { $lt: end_time },
              end_time: { $gt: start_time },
            },
          ],
        });

        if (!overlappingSlot) {
          const newSlot = await Slot.create({
            game_id,
            start_time,
            end_time,
            availability: slot.availability,
            day: targetDay,
            slot_price: slot.slot_price,
            slot_name: slot.slot_name,
          });

          createdSlots.push({ day: targetDay, slot: newSlot });
        } else {
          skippedSlots.push({ day: targetDay, reason: "Overlapping slot exists" });
        }
      }
    }

    res.status(201).json({
      status: true,
      message: "Slots copied to remaining days.",
      data:createdSlots,
      // skippedSlots,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

const getSlotDetails = async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.id);

    if (!slot) {
      return res.status(404).json({
        status: false,
        message: "Slot not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Slot fetched successfully",
      data: slot,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

const updateSlot = async (req, res) => {
  try {
    const slotId = req.params.id;
    const updateData = { ...req.body };

    const slot = await Slot.findByIdAndUpdate(slotId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!slot) {
      return res.status(404).json({
        status: false,
        message: "Slot not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Slot updated successfully",
      data: slot,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

  const deleteSlot = async (req, res) => {
    try {
      // Fetch the slot first
      const slot = await Slot.findById(req.params.id);

      if (!slot) {
        return res.status(404).json({
          status: false,
          message: "Slot not found",
        });
      }

      // Toggle the values
      const updatedSlot = await Slot.findByIdAndUpdate(
        req.params.id,
        {
          is_active: !slot.is_active,
          is_deleted: !slot.is_deleted,
        },
        { new: true }
      );

      res.status(200).json({
        status: true,
        message: "Slot status updated",
        data: updatedSlot,
      });
    } catch (err) {
      res.status(400).json({
        status: false,
        message: err.message,
      });
    }
  };

const getSlots = async (req, res) => {
  try {
    const id = req.params.id;
    const slots = await Slot.find({
      game_id: id,
    });

    // Function to convert 24-hour time to 12-hour format with AM/PM
    const convertTo12HourFormat = (time) => {
      const [hour, minute] = time.split(":").map(Number);
      const ampm = hour >= 12 ? "PM" : "AM";
      const hour12 = hour % 12 || 12; // Convert 0 to 12 for midnight
      return `${hour12.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")} ${ampm}`;
    };

    // Transform slot data
    const formattedSlots = slots.map((slot) => ({
      ...slot._doc, // Retain other properties
      start_time: convertTo12HourFormat(slot.start_time),
      end_time: convertTo12HourFormat(slot.end_time),
    }));

    res.status(200).json({
      status: true,
      message: "Slots data fetched successfully",
      results: formattedSlots.length,
      data: formattedSlots,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

const getSlots24hour = async (req, res) => {
  try {
    const id = req.params.id;
    const slots = await Slot.find({
      game_id: id,
    });

    res.status(200).json({
      status: true,
      message: "Slots data fetched successfully",
      results: slots.length,
      data: slots,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

module.exports = {
  createSlot,
  copySlotsToRemainingDays,
  getSlotDetails,
  updateSlot,
  deleteSlot,
  getSlots,
  getSlots24hour,
};
