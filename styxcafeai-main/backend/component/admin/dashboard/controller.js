const { default: mongoose } = require("mongoose");
const Booking = require("../booking/model");
const Customer = require("../customer/model");
const StaffMember = require("../staffMember/model");
const Game = require("../../superadmin/game/model");
const Slot = require("../../superadmin/slot/model");
const Item = require("../inventory/item/model");
const ItemGroup = require("../inventory/itemGroup/model");

const getAdminDashboardData = async (req, res) => {
  try {
    const id = req.AdminId

    // Get the total number of bookings
    const totalBookings = await Booking.countDocuments({
      cafe: id,
    });

    // Get total online bookings
    const totalOnlineBookings = await Booking.countDocuments({
      cafe: id,
      mode: "Online",
    });

    // Get total cancelled bookings
    const totalCancelledBookings = await Booking.countDocuments({
      cafe: id,
      status: "Cancelled",
    });

    // Get total offline bookings
    const totalOfflineBookings = await Booking.countDocuments({
      cafe: id,
      mode: "Offline",
    });

    // Get total waiting bookings
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const totalWaitingBookings = await Booking.countDocuments({
      cafe: id,
      slot_date: { $gte: tomorrow },
    });

    // Get total amount of bookings
    const objectId = new mongoose.Types.ObjectId(id);
    const totalAmountAgg = await Booking.aggregate([
      {
        $match: {
          cafe: objectId,
          paid_amount: { $ne: null }, // just in case
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$paid_amount" },
        },
      },
    ]);
    
    const totalAmount = totalAmountAgg[0]?.totalAmount || 0;

    // get recent bookings
    const recentBookings = await Booking.find({
      cafe: id,
    })
      .sort({ slot_date: -1 })
      .limit(6)
      .populate("customer_id")
      .populate("game_id")
      .populate("slot_id")
       
    res.status(200).json({
      status: true,
      message: "Dashboard data fetched successfully",
      data: {
        totalBookings,
        totalOnlineBookings,
        totalOfflineBookings,
        totalCancelledBookings,
        totalWaitingBookings,
        totalAmount,
        recentBookings
      },
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

const getSearchData = async (req, res) => {
  try {
    const query = req.query.search?.trim() || '';
    const cafe = req.AdminId;

    if (!query || !cafe) {
      return res.status(400).json({
        status: false,
        message: 'Search query and cafe are required.',
      });
    }

    // Case-insensitive partial match
    const searchRegex = new RegExp(query, 'i');

    const [bookings, customers, users, games, items, itemGroups] = await Promise.all([
      Booking.find({
        cafe,
        $or: [
          { booking_id: searchRegex },
          { booking_type: searchRegex },
          { mode: searchRegex },
          { status: searchRegex },
        ],
      }),

      Customer.find({
        cafe,
        $or: [{ name: searchRegex }, { email: searchRegex }],
      }),

      StaffMember.find({
        cafe,
        $or: [{ name: searchRegex }, { username: searchRegex }],
      }),

      Game.find({
        cafe,
        name: searchRegex,
      }),

      Item.find({
        cafe,
        name: searchRegex,
      }),

      ItemGroup.find({
        cafe,
        group_name: searchRegex,
      }),
    ]);

    res.json({
      status: true,
      data: {
        bookings,
        customers,
        users,
        games,
        items,
        itemGroups,
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
  getAdminDashboardData,
  getSearchData
};