const Offer = require("./model");

const createOffer = async (req, res) => {
  try {
    let {
      cafe,
      name,
      description,
      coupon_code,
      type,
      from_datetime,
      to_datetime,
      game,
      min_amount,
      max_amount,
      discount,
    } = req.body;

    if (type === "on game" && !game) {
      return res.status(400).json({
        status: false,
        message: "Game is required for 'on game' type",
      });
    }

    if (type === "on date" && (!from_datetime || !to_datetime)) {
      return res.status(400).json({
        status: false,
        message:
          "Start date and time and end date and time are required for 'on date' type",
      });
    }

    if (type === "on amount" && (!min_amount || !max_amount)) {
      return res.status(400).json({
        status: false,
        message:
          "Minimum amount and maximum amount are required for 'on amount' type",
      });
    }

    if (type === "on amount" || type === "on date") {
      game = null;
    }

    const newOffer = await Offer.create({
      cafe,
      name,
      description,
      coupon_code,
      type,
      from_datetime,
      to_datetime,
      game,
      min_amount,
      max_amount,
      discount,
    });

    // Populate the game field to include name
    const populatedOffer = await Offer.findById(newOffer._id)
      .populate("game", "name") // Only fetch the name field from the Game collection
      .exec();

    // Emit Socket.io event for real-time update
    try {
      const { emitToCustomers, EVENTS } = require("../../../socket/socketManager");
      emitToCustomers(EVENTS.OFFER_CREATED, populatedOffer);
    } catch (socketError) {
      console.log("Socket.io emit error:", socketError.message);
    }

    res.status(201).json({
      status: true,
      message: "Offer created successfully",
      data: populatedOffer,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

const getOfferDetails = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({
        status: "Failed to fetch offer details",
        message: "Offer details not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Offer details fetched successfully",
      data: offer,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: "Failed to fetch offer details",
      error: err.message,
    });
  }
};

const updateOffer = async (req, res) => {
  try {
    const offerId = req.params.id;
    const updateData = { ...req.body };

    const offer = await Offer.findByIdAndUpdate(offerId, updateData, {
      new: true,
      runValidators: true,
    }).populate("game", "name"); // Populate game field with name

    if (!offer) {
      return res.status(404).json({
        status: false,
        message: "Offer not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Offer details updated successfully",
      data: offer,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

const deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(
      req.params.id,
      { is_active: false, is_deleted: true },
      { new: true }
    );

    if (!offer) {
      return res.status(404).json({
        status: false,
        message: "Offer not found",
      });
    }

    res.status(204).json({
      status: true,
      message: "Offer marked as deleted",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: "Failed to delete offer",
      error: err.message,
    });
  }
};

const getOffers = async (req, res) => {
  try {
    const id = req.params.id;
    const offers = await Offer.find({
      is_active: true,
      is_deleted: false,
      cafe: id,
    }).populate("game", "name");

    res.status(200).json({
      status: true,
      message: "Offers data fetched successfully",
      results: offers.length,
      data: offers,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: "Failed to fetch offers data",
      error: err.message,
    });
  }
};

module.exports = {
  createOffer,
  getOfferDetails,
  updateOffer,
  deleteOffer,
  getOffers,
};
