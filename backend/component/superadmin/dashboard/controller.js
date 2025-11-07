const Booking = require("../../admin/booking/model");
const Customer = require("../../admin/customer/model");
const Vendor = require("../../admin/inventory/vendor/model");
const StaffMember = require("../../admin/staffMember/model");
const Cafe = require("../cafe/model");
const Game = require("../game/model");
const Location = require("../location/model");
const Membership = require("../membership/model");

const getCounts = async (req, res) => {
  try {
    //   const cafeId = req.params.id;

    const [
      customersCount,
      staffMembersCount,
      locationsCount,
      cafesCount,
      gamesCount,
      membershipsCount,
    ] = await Promise.all([
      Customer.countDocuments(),
      StaffMember.countDocuments(),
      Location.countDocuments(),
      Cafe.countDocuments(),
      Game.countDocuments(),
      Membership.countDocuments(),
    ]);

    res.status(200).json({
      status: true,
      message: "Counts fetched successfully",
      data: {
        customers: customersCount,
        staffMembers: staffMembersCount,
        locations: locationsCount,
        cafes: cafesCount,
        games: gamesCount,
        memberships: membershipsCount,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

const getDashboardData = async (req, res) => {
  try {
    const now = new Date();

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      0,
      23,
      59,
      59,
      999
    );

    // Total counts
    const totalCafes = await Cafe.countDocuments();
    const totalVendors = await Vendor.countDocuments({
      userType: "superadmin",
      is_active: true,
      is_deleted: false,
    });
    const totalLocations = await Location.countDocuments();

    // Recent
    const recentLocations = await Location.find()
      .sort({ createdAt: -1 })
      .limit(5);
    const recentCafes = await Cafe.find()
      .populate("location")
      .sort({ createdAt: -1 })
      .limit(5);
    const recentVendors = await Vendor.find({
      userType: "superadmin",
      is_active: true,
      is_deleted: false,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    // This month counts
    const cafesThisMonth = await Cafe.countDocuments({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const vendorsThisMonth = await Vendor.countDocuments({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
      userType: "superadmin",
    });

    const locationsThisMonth = await Location.countDocuments({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    });

    // Last month counts
    const cafesLastMonth = await Cafe.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
    });

    const vendorsLastMonth = await Vendor.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
      userType: "superadmin",
    });

    const locationsLastMonth = await Location.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
    });

    // Calculate percentage change
    const getPercentageChange = (current, previous) => {
      if (previous === 0 && current > 0) return 100;
      if (previous === 0 && current === 0) return 0;
      return ((current - previous) / previous) * 100;
    };

    const cafesChange = getPercentageChange(cafesThisMonth, cafesLastMonth);
    const vendorsChange = getPercentageChange(
      vendorsThisMonth,
      vendorsLastMonth
    );
    const locationsChange = getPercentageChange(
      locationsThisMonth,
      locationsLastMonth
    );

    const totalCommissions = await Booking.aggregate([
      // Match only valid bookings if needed (optional)
      {
        $match: {
          game_id: { $ne: null },
          so_id: { $ne: null },
        },
      },
      // Lookup to bring game data
      {
        $lookup: {
          from: "games",
          localField: "game_id",
          foreignField: "_id",
          as: "game",
        },
      },
      {
        $unwind: "$game",
      },
      // Lookup to bring sales order (so_id) data
      {
        $lookup: {
          from: "invsos", // Make sure this matches your collection name
          localField: "so_id",
          foreignField: "_id",
          as: "so",
        },
      },
      {
        $unwind: "$so",
      },
      // Compute base and commission
      {
        $addFields: {
          commissionBase: { $subtract: ["$total", "$so.total"] },
          commissionRate: "$game.commission",
        },
      },
      {
        $addFields: {
          commission: {
            $divide: [
              { $multiply: ["$commissionBase", "$commissionRate"] },
              100,
            ],
          },
        },
      },
      // Group to sum total commissions
      {
        $group: {
          _id: null,
          totalCommission: { $sum: "$commission" },
          bookingCount: { $sum: 1 },
        },
      },
    ]);

    const monthlyCommissions = await Booking.aggregate([
      {
        $match: {
          game_id: { $ne: null },
        },
      },
      {
        $lookup: {
          from: "games",
          localField: "game_id",
          foreignField: "_id",
          as: "game",
        },
      },
      { $unwind: "$game" },
      {
        $lookup: {
          from: "invsos", // or correct collection name
          localField: "so_id",
          foreignField: "_id",
          as: "so",
        },
      },
      {
        $unwind: {
          path: "$so",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          commissionBase: {
            $subtract: ["$total", { $ifNull: ["$so.total", 0] }],
          },
          commissionRate: "$game.commission",
          month: { $month: "$slot_date" }, // Use slot_date to categorize by month
        },
      },
      {
        $addFields: {
          commission: {
            $divide: [
              { $multiply: ["$commissionBase", "$commissionRate"] },
              100,
            ],
          },
        },
      },
      {
        $group: {
          _id: "$month",
          totalCommission: { $sum: "$commission" },
          bookingCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id",
          totalCommission: { $round: ["$totalCommission", 2] },
          bookingCount: 1,
        },
      },
      {
        $sort: { month: 1 },
      },
    ]);

    const fullMonths = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      totalCommission: 0,
      bookingCount: 0,
    }));

    // Merge aggregation results with default 12 months
    const monthlyData = fullMonths.map((m) => {
      const found = monthlyCommissions.find((item) => item.month === m.month);
      return found || m;
    });

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday as start of week
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(now);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday as end of week
    endOfWeek.setHours(23, 59, 59, 999);

    // Map MongoDB day numbers to names
    const weeklyRevenue = await Booking.aggregate([
      {
        $match: {
          game_id: { $ne: null },
          slot_date: { $gte: startOfWeek, $lte: endOfWeek },
        },
      },
      {
        $lookup: {
          from: "games",
          localField: "game_id",
          foreignField: "_id",
          as: "game",
        },
      },
      { $unwind: "$game" },
      {
        $lookup: {
          from: "invsos",
          localField: "so_id",
          foreignField: "_id",
          as: "so",
        },
      },
      {
        $unwind: {
          path: "$so",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          commissionBase: {
            $subtract: ["$total", { $ifNull: ["$so.total", 0] }],
          },
          commissionRate: "$game.commission",
          dayOfWeek: { $dayOfWeek: "$slot_date" }, // Sunday = 1, Saturday = 7
        },
      },
      {
        $addFields: {
          commission: {
            $divide: [
              { $multiply: ["$commissionBase", "$commissionRate"] },
              100,
            ],
          },
        },
      },
      {
        $group: {
          _id: "$dayOfWeek",
          totalCommission: { $sum: "$commission" },
          bookingCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          day: "$_id",
          totalCommission: { $round: ["$totalCommission", 2] },
          bookingCount: 1,
        },
      },
      {
        $sort: { day: 1 }, // Optional: sort Sunday to Saturday
      },
    ]);

    const dayNameMap = {
      1: "Sunday",
      2: "Monday",
      3: "Tuesday",
      4: "Wednesday",
      5: "Thursday",
      6: "Friday",
      7: "Saturday",
    };

    // Build complete 7-day array with default values
    const fullWeek = [1, 2, 3, 4, 5, 6, 7].map((dayNum) => {
      const found = weeklyRevenue.find((item) => item.day === dayNum);
      return {
        day: dayNameMap[dayNum],
        totalCommission: found ? found.totalCommission : 0,
        bookingCount: found ? found.bookingCount : 0,
      };
    });

    const totalRevenueData = await Booking.aggregate([
      {
        $match: {
          game_id: { $ne: null },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total" },
        },
      },
    ]);

    res.status(200).json({
      status: true,
      message: "Dashboard data fetched successfully",
      data: {
        totalCafes,
        totalVendors,
        totalLocations,
        recentCafes,
        recentLocations,
        recentVendors,
        cafesThisMonth,
        vendorsThisMonth,
        locationsThisMonth,
        changePercentages: {
          cafes: cafesChange,
          vendors: vendorsChange,
          locations: locationsChange,
        },
        totalCommissions: totalCommissions[0]
          ? Math.round(totalCommissions[0].totalCommission)
          : 0,
        monthlyCommissions: monthlyData,
        weeklyRevenue: fullWeek,
        totalRevenue: totalRevenueData[0]?.totalRevenue || 0,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

module.exports = { getCounts, getDashboardData };