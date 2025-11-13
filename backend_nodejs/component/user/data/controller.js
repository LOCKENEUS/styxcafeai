const Customer = require("../../admin/customer/model");
const Item = require("../../admin/inventory/item/model");
const Cafe = require("../../superadmin/cafe/model");
const Game = require("../../superadmin/game/model");
const Location = require("../../superadmin/location/model");
const Slot = require("../../superadmin/slot/model");
const mongoose = require("mongoose");

const getLocations = async (req, res) => {
  try {
    const locations = await Location.find({ is_active: true, is_deleted: false });

    res.status(200).json({
      status: true,
      message: 'Locations fetched successfully',
      results: locations.length,
      data: locations,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

const getRecentCafes = async (req, res) => {
  try {
    // Support both GET (query params) and POST (body) requests
    const { game, location } = req.method === 'GET' ? req.query : req.body;

    const matchStage = {
      is_active: true,
      is_deleted: false,
    };

    // If location filter provided
    if (location) {
      matchStage.location = new mongoose.Types.ObjectId(location);
    }

    const pipeline = [
      { $match: matchStage },

      // Populate games
      {
        $lookup: {
          from: "games",
          localField: "_id",
          foreignField: "cafe",
          as: "games",
        },
      },
    ];

    // Filter by game name (if provided)
    if (game) {
      pipeline.push({
        $match: {
          "games.name": { $regex: game, $options: "i" },
        },
      });
    }

    // Fetch latest 5 if no filters
    if (!game && !location) {
      pipeline.push({ $sort: { createdAt: -1 } }, { $limit: 5 });
    }

    // ✅ Populate location (and include only location name)
    pipeline.push(
      {
        $lookup: {
          from: "locations",
          localField: "location",
          foreignField: "_id",
          as: "location",
        },
      },
      { $unwind: { path: "$location", preserveNullAndEmptyArrays: true } },

      // ✅ Only include location name in response
      {
        $project: {
          name: 1,
          cafe_name: 1,
          address: 1,
          cafeImage: 1,
          is_active: 1,
          is_deleted: 1,
          games: 1,
          createdAt: 1,
          "location._id": 1,  // optional: if you want to keep the location id
          "location.city": 1, // or use "location.name" if your field is called name
        },
      }
    );

    const cafes = await Cafe.aggregate(pipeline);

    res.status(200).json({
      status: true,
      message:
        !game && !location
          ? "Latest 5 cafes fetched successfully"
          : "Cafes fetched successfully",
      count: cafes.length,
      data: cafes,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

const getCafesByFilter = async (req, res) => {
  try {
    const { game, location } = req.body;

    const matchStage = {
      is_active: true,
      is_deleted: false,
    };

    if (location) {
      matchStage.location = new mongoose.Types.ObjectId(location);
    }

    const pipeline = [
      { $match: matchStage },

      {
        $lookup: {
          from: "games", // Game collection name
          localField: "_id",
          foreignField: "cafe",
          as: "games",
        },
      },
    ];

    // If game filter exists, apply regex match on joined games
    if (game) {
      pipeline.push({
        $match: {
          "games.name": {
            $regex: game,
            $options: "i", // Case-insensitive partial match
          },
        },
      });
    }

    pipeline.push({
      $project: {
        name: 1,
        location: 1,
        cafe_name: 1,
        address: 1,
        cafeImage: 1,
        is_active: 1,
        is_deleted: 1,
        games: 1,
      },
    });

    const cafes = await Cafe.aggregate(pipeline);

    res.status(200).json({
      status: true,
      message: "Cafes fetched successfully",
      count: cafes.length,
      data: cafes,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

const getFilteredCafes = async (req, res) => {
  try {
    const { games = [], location } = req.body;

    const matchStage = {
      is_active: true,
      is_deleted: false,
    };

    if (location) {
      matchStage.location = new mongoose.Types.ObjectId(location);
    }

    const pipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: "games",
          localField: "_id",
          foreignField: "cafe",
          as: "games",
        },
      }
    ];

    // If games array is provided, filter cafes that have at least one matching game
    if (Array.isArray(games) && games.length > 0) {
      pipeline.push({
        $match: {
          "games.name": {
            $in: games.map((g) => new RegExp(g, "i")) // case-insensitive matching
          },
        },
      });
    }

    pipeline.push({
      $project: {
        name: 1,
        location: 1,
        cafe_name: 1,
        address: 1,
        cafeImage: 1,
        is_active: 1,
        is_deleted: 1,
        games: 1,
      },
    });

    const cafes = await Cafe.aggregate(pipeline);

    res.status(200).json({
      status: true,
      message: "Cafes fetched successfully",
      count: cafes.length,
      data: cafes,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

const getCafeDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const cafe = await Cafe.findById(id).populate("location");

    if (!cafe) {
      return res.status(404).json({
        status: false,
        message: "Cafe not found",
      });
    }

    // Get all games for the cafe
    const allGames = await Game.find({ cafe: id });

    const cafeObj = cafe.toObject();
    cafeObj.games = allGames;

    res.status(200).json({
      status: true,
      message: "Cafe fetched successfully",
      data: cafeObj,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

const getGameDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const game = await Game.findById(id);
    if (!game) {
      return res.status(404).json({
        status: false,
        message: "Game not found",
      });
    }

    // Get all slots for the game
    const allSlots = await Slot.find({ game_id: id });

    // Group slots by day
    const slotsByDay = {};
    allSlots.forEach(slot => {
      const day = slot.day;
      if (!slotsByDay[day]) {
        slotsByDay[day] = [];
      }
      slotsByDay[day].push(slot);
    });

    const gameData = game.toObject();
    gameData.slots = slotsByDay; // now slots are grouped day-wise

    return res.status(200).json({
      status: true,
      message: "Game fetched successfully",
      data: gameData,
    });

  } catch (err) {
    return res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

const getProfileDetails = async (req, res) => {

  try {
    const user = await Customer.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      status: true,
      message: "User profile fetched successfully",
      data: user,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: "Failed to fetch user profile",
      error: err.message,
    });
  }
};

const updateProfileDetails = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    const updatedData = {};
    if (name) updatedData.name = name;
    if (email) updatedData.email = email;
    if (phone) updatedData.phone = phone;
    if (address) updatedData.address = address;

    if (req.file) {
      updatedData.customerProfile = req.file.path
        .replace(/^.*[\\/](uploads[\\/])/, "uploads/")
        .replace(/\\/g, "/");
    }

    const user = await Customer.findByIdAndUpdate(
      req.user.id,
      { $set: updatedData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "User profile updated successfully",
      data: user,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: "Failed to update user profile",
      error: err.message,
    });
  }
};

const getCafeItems = async (req, res) => {
  try {
    const id = req.params.id;

    const items = await Item.find({ cafe: id, is_active: true, is_deleted: false }).sort({ createdAt: -1 }).populate("tax");

    res.status(200).json({
      status: true,
      message: "Items fetched successfully",
      results: items.length,
      data: items,
    });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

module.exports = {
  getCafeDetails,
  getGameDetails,
  getCafesByFilter,
  getLocations,
  getFilteredCafes,
  getProfileDetails,
  updateProfileDetails,
  getCafeItems,
  getRecentCafes
};