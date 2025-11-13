const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Game = require("./model");
const { formatTimestamps } = require("../../../utils/utils");
const Booking = require("../../admin/booking/model");
const { default: mongoose } = require("mongoose");
const Slot = require("../slot/model");

const createGame = async (req, res) => {
  try {
    const {
      cafe,
      name,
      type,
      price,
      zone,
      size,
      cancellation,
      details,
      commission,
      players,
      payLater,
      amenities,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({
        status: false,
        message: "Game image is required",
      });
    }

    const gameImage = req.file.path
      .replace(/^.*[\\/](uploads[\\/])/, "uploads/")
      .replace(/\\/g, "/");

    let parsedAmenities = [];
    try {
      parsedAmenities =
        typeof amenities === "string" ? JSON.parse(amenities) : amenities;
    } catch (err) {
      return res.status(400).json({
        status: false,
        message: "Invalid amenities format. Should be a JSON array of strings.",
      });
    }

    const newGame = await Game.create({
      cafe,
      name,
      type,
      price,
      zone,
      size,
      cancellation,
      gameImage,
      details,
      commission,
      players,
      payLater,
      amenities: parsedAmenities,
    });

    // Emit Socket.io event for real-time update
    try {
      const { emitToCustomers, EVENTS } = require("../../../socket/socketManager");
      emitToCustomers(EVENTS.GAME_CREATED, newGame);
    } catch (socketError) {
      console.log("Socket.io emit error:", socketError.message);
    }

    res.status(201).json({
      status: true,
      message: "Game created successfully",
      data: newGame,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

const getGameOrGames = async (req, res) => {
  try {
    const { id } = req.params;

    const game = await Game.findById(id);

    if (game) {
      // Fetch bookings for this game
      const bookings = await Booking.find({ game_id: id }).populate("so_id");

      // Calculate total booking amount and total SO amount
      let bookingTotal = 0;
      let salesOrderTotal = 0;

      for (const booking of bookings) {
        bookingTotal += booking.total || 0;
        salesOrderTotal += booking.so_id?.total || 0;
      }

      // Calculate commission
      const commissionRate = game.commission || 0;
      const commissionBase = bookingTotal - salesOrderTotal;
      const totalCommission = (commissionBase * commissionRate) / 100;

      // Available slots

      // Get today's date range (from 00:00 to 23:59)
      const today = new Date();
      const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      const endOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1
      );

      const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const todayName = daysOfWeek[today.getDay()];

      // Find bookings for today
      const todayBookings = await Booking.find({
        game_id: id,
        slot_date: { $gte: startOfDay, $lt: endOfDay },
      });

      // Get all slots for the game
      const allSlots = await Slot.find({ game_id: id, day: todayName }); // Adjust if slots are linked differently
      const bookedSlotIds = todayBookings.map((b) => b.slot_id.toString());

      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, "0");
      const currentMinutes = String(now.getMinutes()).padStart(2, "0");
      const currentTimeStr = `${currentHours}:${currentMinutes}`;

      // Filter: not booked & not in the past
      const availableSlots = allSlots.filter((slot) => {
        const isBooked = bookedSlotIds.includes(slot._id.toString());
        const isPast = slot.start_time < currentTimeStr;
        return !isBooked && !isPast;
      });

      const gameData = game.toObject(); // Convert to plain JS object
      gameData.totalCommission = totalCommission;
      gameData.bookingsCount = bookings.length;
      gameData.availableSlots = availableSlots.length;

      return res.status(200).json({
        status: true,
        message: "Game fetched successfully",
        data: gameData,
      });
    }

    // If not a game id, treat as cafe id and get games list
    const games = await Game.find({
      cafe: id,
      is_active: true,
      is_deleted: false,
    });

    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const todayName = daysOfWeek[today.getDay()];
    const currentHours = String(today.getHours()).padStart(2, "0");
    const currentMinutes = String(today.getMinutes()).padStart(2, "0");
    const currentTimeStr = `${currentHours}:${currentMinutes}`;

    // Add availableSlots count to each game
    const gamesWithSlots = await Promise.all(
      games.map(async (game) => {
        // Get today’s bookings for this game
        const todayBookings = await Booking.find({
          game_id: game._id,
          slot_date: { $gte: startOfDay, $lt: endOfDay },
        });

        const bookedSlotIds = todayBookings.map((b) => b.slot_id.toString());

        // Get today's slots
        const allSlots = await Slot.find({ game_id: game._id, day: todayName });

        // Filter out booked & past slots
        const availableSlots = allSlots.filter((slot) => {
          const isBooked = bookedSlotIds.includes(slot._id.toString());
          const isPast = slot.start_time < currentTimeStr;
          return !isBooked && !isPast;
        });

        // Add to game object
        const gameObj = game.toObject();
        gameObj.availableSlots = availableSlots.length;

        return gameObj;
      })
    );

    return res.status(200).json({
      status: true,
      message: "Games fetched successfully",
      results: gamesWithSlots.length,
      data: gamesWithSlots,
    });
  } catch (err) {
    return res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

const updateGame = async (req, res) => {
  try {
    const gameId = req.params.id;
    const updateData = { ...req.body };

    if (req.file) {
      updateData.gameImage = req.file.path
        .replace(/^.*[\\/](uploads[\\/])/, "uploads/")
        .replace(/\\/g, "/");
    }

    const game = await Game.findByIdAndUpdate(gameId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!game) {
      return res.status(404).json({
        status: false,
        message: "Game not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Game updated successfully",
      data: game,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

const deleteGame = async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(
      req.params.id,
      { is_active: false, is_deleted: true },
      { new: true }
    );

    if (!game) {
      return res.status(404).json({
        status: false,
        message: "Game not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Game marked as deleted",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

// Utility functions to get date ranges
const getStartOfToday = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

const getEndOfToday = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
};

const getStartOfWeek = () => {
  const now = new Date();
  const day = now.getDay() || 7; // Sunday = 0 => 7
  now.setHours(0, 0, 0, 0);
  now.setDate(now.getDate() - day + 1);
  return now;
};

const getEndOfWeek = () => {
  const start = getStartOfWeek();
  const end = new Date(start);
  end.setDate(end.getDate() + 7);
  return end;
};

const getStartOfMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
};

const getEndOfMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 1);
};

const getGameCommissions = async (req, res) => {
  try {
    const cafeId = req.params.id;
    const { filter, game, startDate, endDate } = req.body;

    // start_date, end_date
    const match = {
      cafe: cafeId,
    };

    if (filter === "today") {
      match.createdAt = {
        $gte: getStartOfToday(),
        $lt: getEndOfToday(),
      };
    } else if (filter === "this_week") {
      match.createdAt = {
        $gte: getStartOfWeek(),
        $lt: getEndOfWeek(),
      };
    } else if (filter === "this_month") {
      match.createdAt = {
        $gte: getStartOfMonth(),
        $lt: getEndOfMonth(),
      };
    } else if (filter === "custom_date" && startDate && endDate) {
      match.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (game && mongoose.Types.ObjectId.isValid(game)) {
      match.game_id = new mongoose.Types.ObjectId(game);
    }

    const bookings = await Booking.find(match)
      .populate("game_id", "name commission")
      .populate("so_id", "total")
      .lean();

    let totalCommission = 0;

    const result = bookings.map((booking) => {
      const bookingTotal = booking.total || 0;
      const soTotal = booking.so_id?.total || 0;
      const commissionRate = booking.game_id?.commission || 0;

      const commissionBase = bookingTotal - soTotal;
      const commission = (commissionBase * commissionRate) / 100;

      totalCommission += commission;

      return {
        booking_id: booking.booking_id,
        game_id: booking.game_id || null,
        game_commission_rate: commissionRate,
        booking_total: bookingTotal,
        so_total: soTotal,
        commission_base: commissionBase,
        commission: parseFloat(commission.toFixed(2)),
      };
    });

    return res.status(200).json({
      status: true,
      message: "Commission report fetched successfully",
      totalBookings: bookings.length,
      totalCommission: parseFloat(totalCommission.toFixed(2)),
      data: result,
    });
  } catch (error) {
    console.error("Error generating commission report:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  createGame,
  updateGame,
  deleteGame,
  getGameOrGames,
  getGameCommissions,
};
