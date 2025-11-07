const Razorpay = require("razorpay");
const crypto = require("crypto");
const Booking = require("../../admin/booking/model");
const Game = require("../../superadmin/game/model");
const Transaction = require("../../admin/booking/payment.model");
const BookItem = require("../../admin/inventory/purchaseOrder/bookItemModel");
const InvSo = require("../../admin/inventory/salesOrder/model");

const razorpay = new Razorpay({
  key_id: process.env.RAZOR_LIVE_KEY,
  key_secret: process.env.RAZOR_LIVE_SECRET,
});

const createBooking = async (req, res) => {
  try {
    let {
      customer_id,
      game_id,
      game_amount,
      slot_id,
      slot_date,
      total,
      booking_status,
      paid_amount,
      mode,
      txn_id,
    } = req.body;

    // Step 2: Generate Booking ID in IST
    const now = new Date(); // Current time in UTC
    const istNow = new Date(now.getTime() + 5.5 * 60 * 60 * 1000); // Convert to IST

    const year = istNow.getFullYear().toString().slice(-2); // '25' for 2025
    const month = String(istNow.getMonth() + 1).padStart(2, "0"); // '03' for March
    const date = String(istNow.getDate()).padStart(2, "0"); // '01' for 1st

    // Step 3: Calculate UTC Start and End for the IST day
    const startOfDayIST = new Date(
      istNow.setHours(0, 0, 0, 0) - 5.5 * 60 * 60 * 1000
    );
    const endOfDayIST = new Date(
      istNow.setHours(23, 59, 59, 999) - 5.5 * 60 * 60 * 1000
    );

    const bookingCount = await Booking.countDocuments({
      createdAt: { $gte: startOfDayIST, $lt: endOfDayIST },
    });

    const bookingId = `B-${year}${month}${date}${(bookingCount + 1)
      .toString()
      .padStart(2, "0")}`;

    // get commission rate
    const game = await Game.findById(game_id);

    // Step 4: Create the booking with generated Booking ID
    const newBooking = await Booking.create({
      booking_id: bookingId,
      booking_type : "Regular",
      cafe: req.body.cafe,
      customer_id,
      game_id,
      slot_id,
      slot_date,
      status: "Paid",
      booking_status,
      total,
      paid_amount,
      mode,
      txn_id,
      game_amount,
    });

    res.status(201).json({
      status: true,
      message: "Booking created successfully",
      data: newBooking,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: "Failed to create new booking",
      error: err.message,
    });
  }
};

const getBookingDetails = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("cafe")
      .populate("customer_id")
      .populate("game_id")
      .populate("slot_id")
      .populate("players")
      .populate("transaction")
      .populate("looserPlayer", "name contact_no")
      .populate({
        path: "so_id",
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
      .populate({
        path: "playerCredits",
        populate: {
          path: "id",
        },
      })
      .lean(); // plain JS object

    booking.playerCredits = booking.playerCredits.map((pc) => ({
      name: pc.id?.name || "Unknown",
      credit: pc.credit,
      paid_amount: pc.paid_amount,
      status: pc.status,
      _id: pc.id._id,
    }));

    if (!booking) {
      return res.status(404).json({
        status : false,
        message: "Booking not found",
      });
    }

    // ✅ Add custom "item" field with item_id.name
    if (booking.so_id?.items?.length) {
      booking.so_id.items = booking.so_id.items.map((item) => ({
        ...item,
        item: item.item_id?.name || "",
      }));
    }

    // Total games as customer & player
    const customerId = booking.customer_id._id;

    const totalAsCustomer = await Booking.countDocuments({
      cafe: booking.cafe,
      customer_id: customerId,
    });

    const totalAsPlayer = await Booking.countDocuments({
      cafe: booking.cafe,
      players: customerId,
    });

    const totalGamesPlayed = totalAsCustomer + totalAsPlayer;

    res.status(200).json({
      status: true,
      mesage: "Booking details fetched successfully",
      data: {
        ...booking,
        totalGamesAsCustomer: totalAsCustomer,
        totalGamesAsPlayer: totalAsPlayer,
        totalGamesPlayed,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: "Failed to fetch booking details",
      error: err.message,
    });
  }
};

const getBookingList = async (req, res) => {
  try {
    const bookings = await Booking.find({ customer_id: req.user.id })
      .populate({
        path: "cafe",
        populate: {
          path: "location", // populate location inside cafe
          model: "Location", // make sure this matches your Location model name
          // select: "name address city", // optional: select only required fields
        },
      })
      .populate("customer_id", "name email")
      .populate("game_id", "name price payLater start_time end_time")
      .populate("slot_id", "start_time end_time")
      .populate({
        path: "so_id",
        populate: [
          {
            path: "items", // Step 1: populate BookItems
            populate: {
              path: "item_id", // Step 2: populate actual item data
              model: "Item",
              populate: {
                path: "tax",
                model: "Tax",
                // select: "name percentage",
              },
            },
          },
        ],
      })
      .populate("players", "name")
      .sort({ createdAt: -1 })
      .lean();

    // Modify only the so_id format
    const mergedBookings = bookings.map((booking) => ({
      _id: booking._id,
      cafeName: booking.cafe?.name,
      cafeLocation: booking.cafe?.location,
      customerName: booking.customer_id?.name,
      customerEmail: booking.customer_id?.email,
      gameTitle: booking.game_id?.name,
      gamePrice: booking.game_id?.price,
      slotStartTime: booking.slot_id?.start_time,
      slotEndTime: booking.slot_id?.end_time,
      players: booking.players?.map((player) => player.name),
      // Keep rest of booking fields same
      ...booking,
      // ✅ Updated so_id format
      so_id: booking.so_id
        ? {
            _id: booking.so_id._id,
            invoice_no: booking.so_id.invoice_no,
            total_amount: booking.so_id.total_amount,
            paid_amount: booking.so_id.paid_amount,
            balance_amount: booking.so_id.balance_amount,
            tax: booking.so_id.tax
              ? {
                  _id: booking.so_id.tax._id,
                  name: booking.so_id.tax.name,
                  percentage: booking.so_id.tax.percentage,
                }
              : null,
            items: booking.so_id.items?.map((i) => ({
              _id: i._id,
              quantity: i.quantity,
              price: i.price,
              total: i.total,
              item_id: i.item_id
                ? {
                    _id: i.item_id._id,
                    name: i.item_id.name,
                    price: i.item_id.price,
                    tax: i.item_id.tax,
                  }
                : null,
            })),
            createdAt: booking.so_id.createdAt,
            updatedAt: booking.so_id.updatedAt,
          }
        : null,
    }));

    res.status(200).json({
      status: true,
      message: "Bookings fetched successfully",
      results: mergedBookings.length,
      data: mergedBookings,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: "Failed to fetch booking data",
      error: err.message,
    });
  }
};

const payment = async (req, res) => {
  try {
    const { amount, currency = "INR", receipt } = req.body;

    const options = {
      amount: amount * 100, // Convert to paise
      currency,
      receipt,
      payment_capture: 1, // Auto capture payment
    };
    const order = await razorpay.orders.create(options);
    res.json({ 
      success: true, 
      message: "Order created successfully",
      data: order 
    });
  } catch (error) {
    res.status(500).json({ 
      status: false, 
      message: "Failed to create order", 
      error: error.message 
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingPayload, // <-- send booking + items data here from frontend
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZOR_LIVE_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ status: false, message: "Invalid Signature" });
    }

    // STEP 1: Create booking (same logic as createBooking)
    const now = new Date();
    const istNow = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);

    const year = istNow.getFullYear().toString().slice(-2);
    const month = String(istNow.getMonth() + 1).padStart(2, "0");
    const date = String(istNow.getDate()).padStart(2, "0");

    const startOfDayIST = new Date(istNow.setHours(0, 0, 0, 0) - 5.5 * 60 * 60 * 1000);
    const endOfDayIST = new Date(istNow.setHours(23, 59, 59, 999) - 5.5 * 60 * 60 * 1000);

    const bookingCount = await Booking.countDocuments({
      createdAt: { $gte: startOfDayIST, $lt: endOfDayIST },
    });

    const bookingId = `B-${year}${month}${date}${(bookingCount + 1)
      .toString()
      .padStart(2, "0")}`;

    const newBooking = await Booking.create({
      booking_id: bookingId,
      booking_type: "Regular",
      cafe: bookingPayload.cafe,
      customer_id: bookingPayload.customer_id,
      game_id: bookingPayload.game_id,
      slot_id: bookingPayload.slot_id,
      slot_date: bookingPayload.slot_date,
      status: "Paid",
      booking_status: "Confirmed",
      total: bookingPayload.total,
      paid_amount: bookingPayload.paid_amount,
      mode: "Online",
      txn_id: razorpay_payment_id,
      game_amount: bookingPayload.game_amount,
    });

    // STEP 2: Save transaction linked to booking
    const transaction = await Transaction.create({
      booking_id: newBooking._id,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount: bookingPayload.total,
      status: "Success",
    });

    // STEP 3: Create SO
    const items = bookingPayload.items || [];
    if (items.length > 0) {
      let pending_qty = items.reduce((sum, item) => sum + parseInt(item.quantity), 0);
      let subtotal = items.reduce((sum, item) => sum + parseInt((item.price * item.quantity) + item.totalTax), 0);

      const lastSo = await InvSo.findOne().sort({ createdAt: -1 });
      let nextSoNumber = 1;
      if (lastSo) {
        const lastNumber = parseInt(lastSo.so_no.split("-")[1], 10);
        nextSoNumber = lastNumber + 1;
      }
      const so_no = `SO-${nextSoNumber.toString().padStart(3, "0")}`;

      const newSo = new InvSo({
        cafe: bookingPayload.cafe,
        customer_id: bookingPayload.customer_id,
        refer_id: newBooking._id,
        so_no,
        date: new Date(),
        shipment_date: new Date(),
        items: [],
        subtotal: subtotal,
        total: subtotal,
        pending_qty,
        type: "SO",
      });

      const savedSo = await newSo.save();

      // STEP 4: Create BookItems
      const bookItemIds = await Promise.all(
        items.map(async (product) => {
          const bookItem = new BookItem({
            item_id: product.id,
            type: "SO",
            refer_id: savedSo._id,
            hsn: product.hsn || 0,
            quantity: product.quantity,
            price: product.price,
            tax: product.tax || null,
            tax_amt: product.tax_amt || 0,
            total: product.total,
          });
          const savedBookItem = await bookItem.save();
          return savedBookItem._id;
        })
      );

      savedSo.items = bookItemIds;
      await savedSo.save();

      // STEP 5: Update booking with refer_id
      newBooking.so_id = savedSo._id;
      await newBooking.save();
    }

    // STEP 6: Update transaction id in booking
    newBooking.transaction = transaction._id;
    await newBooking.save();

    res.json({
      success: true,
      message: "Payment verified & Booking created successfully",
      booking: newBooking,
      transaction,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const getCompletedBookingList = async (req, res) => {
  try {
    // Get current date and time
    const now = new Date();

    // Find bookings where status is Paid and slot_date + slot end_time is in the past
    const bookings = await Booking.find({
      customer_id: req.user.id,
      status: "Paid",
      slot_date: { $lte: now }
    })
      .populate("cafe", "name location")
      .populate("customer_id", "name email")
      .populate("game_id", "name price payLater start_time end_time")
      .populate("slot_id", "start_time end_time")
      .populate("players", "name")
      .sort({ createdAt: -1 })
      .lean();

    // Filter bookings where slot end time has passed
    const completedBookings = bookings.filter(booking => {
      if (!booking.slot_id || !booking.slot_id.end_time) return false;
      // Combine slot_date and slot end_time to get the end datetime
      const [endHour, endMinute] = booking.slot_id.end_time.split(":").map(Number);
      const slotEndDateTime = new Date(booking.slot_date);
      slotEndDateTime.setHours(endHour, endMinute, 0, 0);
      return now > slotEndDateTime;
    });

    const mergedBookings = completedBookings.map((booking) => ({
      _id: booking._id,
      cafeName: booking.cafe?.name,
      cafeLocation: booking.cafe?.location,
      customerName: booking.customer_id?.name,
      customerEmail: booking.customer_id?.email,
      gameTitle: booking.game_id?.name,
      gamePrice: booking.game_id?.price,
      slotStartTime: booking.slot_id?.start_time,
      slotEndTime: booking.slot_id?.end_time,
      players: booking.players.map((player) => player.name),
      ...booking,
    }));

    res.status(200).json({
      status: true,
      message: "Completed bookings fetched successfully",
      results: mergedBookings.length,
      data: mergedBookings,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: "Failed to fetch completed bookings",
      error: err.message,
    });
  }
};

const getUpcomingBookingList = async (req, res) => {
  try {
    const now = new Date();

    // Step 1: Fetch bookings where slot_date is today or later
    const bookings = await Booking.find({
      customer_id: req.user.id,
      status: "Paid",
      slot_date: { $gte: new Date(now.setHours(0, 0, 0, 0)) }, // midnight today onwards
    })
      .populate("cafe", "name location")
      .populate("customer_id", "name email")
      .populate("game_id", "name price payLater start_time end_time")
      .populate("slot_id", "start_time end_time")
      .populate("players", "name")
      .sort({ createdAt: -1 })
      .lean();

    // Step 2: Filter logic
    const upcomingBookings = bookings.filter((booking) => {
      if (!booking.slot_id) return false;

      const slotDate = new Date(booking.slot_date);
      const today = new Date();
      const [startHour, startMinute] = booking.slot_id.start_time.split(":").map(Number);
      const [endHour, endMinute] = booking.slot_id.end_time.split(":").map(Number);

      const slotStartDateTime = new Date(slotDate);
      slotStartDateTime.setHours(startHour, startMinute, 0, 0);

      const slotEndDateTime = new Date(slotDate);
      slotEndDateTime.setHours(endHour, endMinute, 0, 0);

      // Include if:
      // 1️⃣ Slot date is in the future, OR
      // 2️⃣ Slot date is today AND now < slot end time
      return slotDate > today.setHours(23, 59, 59, 999) || now < slotEndDateTime;
    });

    // Step 3: Merge & format
    const mergedBookings = upcomingBookings.map((booking) => ({
      _id: booking._id,
      cafeName: booking.cafe?.name,
      cafeLocation: booking.cafe?.location,
      customerName: booking.customer_id?.name,
      customerEmail: booking.customer_id?.email,
      gameTitle: booking.game_id?.name,
      gamePrice: booking.game_id?.price,
      slotStartTime: booking.slot_id?.start_time,
      slotEndTime: booking.slot_id?.end_time,
      players: booking.players?.map((player) => player.name),
      ...booking,
    }));

    res.status(200).json({
      status: true,
      message: "Upcoming bookings fetched successfully",
      results: mergedBookings.length,
      data: mergedBookings,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: "Failed to fetch upcoming bookings",
      error: err.message,
    });
  }
};

const getOngoingBookingList = async (req, res) => {
  try {
    const now = new Date();

    // Find bookings where status is Paid and slot_date is today or in the past
    const bookings = await Booking.find({
      customer_id: req.user.id,
      status: "Paid",
      slot_date: { $lte: now }
    })
      .populate("cafe", "name location")
      .populate("customer_id", "name email")
      .populate("game_id", "name price payLater start_time end_time")
      .populate("slot_id", "start_time end_time")
      .populate("players", "name")
      .sort({ createdAt: -1 })
      .lean();

    // Filter bookings where current time is between slot start and end time
    const ongoingBookings = bookings.filter(booking => {
      if (!booking.slot_id || !booking.slot_id.start_time || !booking.slot_id.end_time) return false;
      const [startHour, startMinute] = booking.slot_id.start_time.split(":").map(Number);
      const [endHour, endMinute] = booking.slot_id.end_time.split(":").map(Number);

      const slotStartDateTime = new Date(booking.slot_date);
      slotStartDateTime.setHours(startHour, startMinute, 0, 0);

      const slotEndDateTime = new Date(booking.slot_date);
      slotEndDateTime.setHours(endHour, endMinute, 0, 0);

      return now >= slotStartDateTime && now < slotEndDateTime;
    });

    const mergedBookings = ongoingBookings.map((booking) => ({
      _id: booking._id,
      cafeName: booking.cafe?.name,
      cafeLocation: booking.cafe?.location,
      customerName: booking.customer_id?.name,
      customerEmail: booking.customer_id?.email,
      gameTitle: booking.game_id?.name,
      gamePrice: booking.game_id?.price,
      slotStartTime: booking.slot_id?.start_time,
      slotEndTime: booking.slot_id?.end_time,
      players: booking.players.map((player) => player.name),
      ...booking,
    }));

    res.status(200).json({
      status: true,
      message: "Ongoing bookings fetched successfully",
      results: mergedBookings.length,
      data: mergedBookings,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: "Failed to fetch ongoing bookings",
      error: err.message,
    });
  }
};

const getGameBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ game_id: req.params.id })
      .populate("cafe", "name location")
      .populate("customer_id", "name email")
      .populate("game_id", "name price")
      .populate("slot_id", "start_time end_time")
      .populate("players", "name")
      .sort({ createdAt: -1 })
      .lean();

    // Merge all references directly into each booking object
    const mergedBookings = bookings.map((booking) => ({
      _id: booking._id,
      cafeName: booking.cafe?.name,
      cafeLocation: booking.cafe?.location,
      customerName: booking.customer_id?.name,
      customerEmail: booking.customer_id?.email,
      gameTitle: booking.game_id?.name,
      gamePrice: booking.game_id?.price,
      slotStartTime: booking.slot_id?.start_time,
      slotEndTime: booking.slot_id?.end_time,
      players: booking.players.map((player) => player.name),
      ...booking, // Spread any other booking data
    }));

    res.status(200).json({
      status: true,
      message: "Bookings fetched successfully",
      results: mergedBookings.length,
      data: mergedBookings,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: "Failed to fetch booking data",
      error: err.message,
    });
  }
};

module.exports = {
  createBooking,
  getBookingDetails,
  getBookingList,
  payment,
  verifyPayment,
  getCompletedBookingList,
  getUpcomingBookingList,
  getOngoingBookingList,
  getGameBookings
};