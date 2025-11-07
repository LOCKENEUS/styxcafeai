const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Booking = require("../booking/model");
const mongoose = require("mongoose");

const generateReport = async (req, res) => {
  try {
    const {
      game,
      start_date,
      end_date,
      game_slot,
      booking_mode,
      payment_mode,
    } = req.body;
    const id = req.params.id;

    const match = {};

    // Only add filters if they are valid (non-empty)
    if (id) {
      match.cafe = new mongoose.Types.ObjectId(id);
    }

    if (game) {
      match.game_id = new mongoose.Types.ObjectId(game);
    }

    if (game_slot) {
      match.slot_id = new mongoose.Types.ObjectId(game_slot);
    }

    let payLaterCondition = undefined;
    if (booking_mode === "true") {
      payLaterCondition = true;
    } else if (booking_mode === "false") {
      payLaterCondition = false;
    }
    delete match.booking_type;

    if (payment_mode) {
      match.mode = payment_mode;
    }

    // Always apply date range
    match.slot_date = {
      $gte: new Date(start_date),
      $lte: new Date(`${end_date}T23:59:59.999Z`),
    };

    const matchStage = { ...match };
    if (payLaterCondition !== undefined) {
      matchStage["game.payLater"] = payLaterCondition;
    }

    const report = await Booking.aggregate([
      // 1. Join main game info (for top-level summary fields)
      {
        $lookup: {
          from: "games",
          localField: "game_id",
          foreignField: "_id",
          as: "game",
        },
      },
      {
        $unwind: {
          path: "$game",
          preserveNullAndEmptyArrays: false, // Remove bookings with no matching game
        },
      },

      // 2. Match filter stage (date range, cafe, game.payLater, etc.)
      { $match: matchStage },

      // 3. Group bookings
      {
        $group: {
          _id: {
            game_id: "$game_id",
            game_slot: "$slot_id",
            payment_mode: "$mode",
            booking_type: "$booking_type",
          },
          total_bookings: { $sum: 1 },
          total_paid: { $sum: "$paid_amount" },
          total: { $sum: "$total" },
          bookings: { $push: "$$ROOT" }, // collect all bookings
        },
      },

      // 4. Add flattened grouping fields
      {
        $addFields: {
          game_id: "$_id.game_id",
          game_slot: "$_id.game_slot",
          payment_mode: "$_id.payment_mode",
          booking_type: "$_id.booking_type",
        },
      },

      // 5. Populate top-level slot
      {
        $lookup: {
          from: "slots",
          localField: "game_slot",
          foreignField: "_id",
          as: "slot",
        },
      },
      { $unwind: { path: "$slot", preserveNullAndEmptyArrays: true } },

      // 6. Populate top-level game (for name only)
      {
        $lookup: {
          from: "games",
          localField: "game_id",
          foreignField: "_id",
          as: "game",
        },
      },
      { $unwind: { path: "$game", preserveNullAndEmptyArrays: true } },

      // 7. Unwind bookings to populate game data inside each booking
      { $unwind: { path: "$bookings" } },

      // 8. Extract game_id to top level for $lookup
      {
        $set: {
          booking: "$bookings",
          booking_game_id: "$bookings.game_id",
        },
      },

      // 9. Lookup game for each booking
      {
        $lookup: {
          from: "games",
          localField: "booking_game_id",
          foreignField: "_id",
          as: "game_lookup",
        },
      },
      {
        $set: {
          "booking.game": { $arrayElemAt: ["$game_lookup", 0] },
        },
      },
      {
        $unset: ["booking_game_id", "game_lookup"],
      },

      // 10. Group back enriched bookings
      {
        $group: {
          _id: {
            game_id: "$game_id",
            game_slot: "$game_slot",
            payment_mode: "$payment_mode",
            booking_type: "$booking_type",
          },
          total_bookings: { $first: "$total_bookings" },
          total_paid: { $first: "$total_paid" },
          total: { $first: "$total" },
          game: { $first: "$game" },
          slot: { $first: "$slot" },
          bookings: { $push: "$booking" },
        },
      },

      // 11. Final projection
      {
        $project: {
          _id: 0,
          game_name: "$game.name",
          slot_start_time: "$slot.start_time",
          slot_end_time: "$slot.end_time",
          payment_mode: "$_id.payment_mode",
          booking_type: "$_id.booking_type",
          total_bookings: 1,
          total_paid: 1,
          total: 1,
          bookings: 1, // each with populated game info
        },
      },
    ]);

    const grandTotalPaid = report.reduce(
      (sum, item) => sum + (item.total_paid || 0),
      0
    );
    const grandTotal = report.reduce((sum, item) => sum + (item.total || 0), 0);
    const totalBookings = report.reduce(
      (sum, item) => sum + (item.total_bookings || 0),
      0
    );

    res.json({
      status: true,
      data: {
        records: report,
        total_bookings: totalBookings,
        total_paid: grandTotalPaid,
        total_amount: grandTotal,
        credit: grandTotal - grandTotalPaid,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

const getBookingsReport = async (req, res) => {
  try {
    const {
      start_date,
      end_date,
      payment_mode,
      booking_type,
      game_type,
      game,
      booking_mode,
      day,
      game_slot,
    } = req.body;

    const cafeId = req.AdminId;
    const payLater =
      booking_mode === "true"
        ? true
        : booking_mode === "false"
        ? false
        : undefined;

    const match = {
      cafe: new mongoose.Types.ObjectId(cafeId),
      slot_date: {
        $gte: new Date(start_date),
        $lte: new Date(`${end_date}T23:59:59.999Z`),
      },
    };

    let bookings = await Booking.find(match)
      .populate("customer_id")
      .populate("game_id")
      .populate("slot_id")
      .populate({
        path: "playerCredits",
        populate: {
          path: "id",
        },
      })
      .populate({
        path: "so_id", // Populate the so_id field
        populate: {
          path: "items",
          populate: [
            {
              path: "item_id",
              select: "name", // only fetch the name field
            },
            {
              path: "tax", // Populate all fields of tax
            },
          ],
        },
      })
      .lean();

    // 2. Apply optional filters
    if (payment_mode && payment_mode !== "Credit") {
      bookings = bookings.filter((b) => b.mode === payment_mode);
    }

    if (payment_mode && payment_mode === "Credit") {
      bookings = bookings.filter((b) => b.paid_amount === 0);
    }

    if (booking_type) {
      bookings = bookings.filter((b) => b.booking_type === booking_type);
    }

    if (game) {
      bookings = bookings.filter(
        (b) => b.game_id && b.game_id._id.toString() === game
      );
    }

    if (game && game_slot) {
      bookings = bookings.filter(
        (b) =>
          b.game_id &&
          b.game_id._id.toString() === game &&
          b.slot_id &&
          b.slot_id._id.toString() === game_slot
      );
    }

    if (game_type) {
      bookings = bookings.filter(
        (b) => b.game_id && b.game_id.zone.toString() === game_type
      );
    }

    if (day) {
      bookings = bookings.filter(
        (b) => b.slot_id && b.slot_id.day.toString() === day
      );
    }

    // 3. If pay_later filter is requested
    if (typeof payLater === "boolean") {
      bookings = bookings.filter((b) => {
        return b.game_id && b.game_id.payLater === payLater;
      });
    }

    // 4. Calculate totals
    const total_amount = bookings.reduce((sum, b) => sum + (b.total || 0), 0);
    const paid_amount = bookings.reduce(
      (sum, b) => sum + (b.paid_amount || 0),
      0
    );
    const credit_amount = total_amount - paid_amount;

    res.status(200).json({
      status: true,
      message: "Bookings report fetched successfully",
      data: {
        total_bookings: bookings.length,
        bookings,
        total_amount,
        paid_amount,
        credit_amount,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

const getCommissionReport = async (req, res) => {
  try {
    const {
      start_date,
      end_date,
      game
    } = req.body;

    const cafeId = req.AdminId;

    const match = {
      cafe: new mongoose.Types.ObjectId(cafeId),
      slot_date: {
        $gte: new Date(start_date),
        $lte: new Date(`${end_date}T23:59:59.999Z`),
      },
    };

    let bookings = await Booking.find(match)
      .populate("customer_id")
      .populate("game_id")
      .populate("slot_id")
      .populate({
        path: "playerCredits",
        populate: {
          path: "id",
        },
      })
      .populate({
        path: "so_id", // Populate the so_id field
        populate: {
          path: "items",
          populate: [
            {
              path: "item_id",
              select: "name", // only fetch the name field
            },
            {
              path: "tax", // Populate all fields of tax
            },
          ],
        },
      })
      .lean();

    if (game) {
      bookings = bookings.filter(
        (b) => b.game_id && b.game_id._id.toString() === game
      );
    }

    // 4. Calculate totals
    const total_commission = bookings.reduce((sum, b) => sum + (b.commission || 0), 0);

    res.status(200).json({
      status: true,
      message: "Bookings report fetched successfully",
      data: {
        total_bookings: bookings.length,
        bookings,
        total_commission,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

module.exports = {
  generateReport,
  getBookingsReport,
  getCommissionReport
};
