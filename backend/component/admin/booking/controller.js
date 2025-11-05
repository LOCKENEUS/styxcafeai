const Booking = require("./model");
const Customer = require("../customer/model");
const Transaction = require("./payment.model");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const InvSo = require("../inventory/salesOrder/model");
const BookItem = require("../inventory/purchaseOrder/bookItemModel");
const Credits = require("./credits.model");
const Game = require("../../superadmin/game/model");
const CreditTransaction = require("../customer/CreditTransaction/model");

const razorpay = new Razorpay({
  key_id: process.env.RAZOR_LIVE_KEY,
  key_secret: process.env.RAZOR_LIVE_SECRET,
});

const createBooking = async (req, res) => {
  try {
    let {
      customer_id,
      booking_type,
      game_id,
      game_amount,
      slot_id,
      slot_date,
      total,
      status,
      paid_amount,
      players,
      playerCredits,
      mode,
      items,
      custom_slot,
      txn_id,
    } = req.body;

    // Step 1: Ensure unique customers and store their IDs
    const customerPromises = players.map(async (player) => {
      let existingCustomer = await Customer.findOne({
        $or: [{ name: player.name }, { contact_no: player.contact_no }],
      });

      if (!existingCustomer) {
        existingCustomer = await Customer.create({
          cafe: req.body.cafe,
          name: player.name,
          contact_no: player.contact_no,
          email: player.email,
        });
      }

      return existingCustomer._id;
    });

    const customerIds = await Promise.all(customerPromises);

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

    if (!slot_id && custom_slot) {
      slot_id = null;
    }

    // get commission rate
    const game = await Game.findById(game_id);
    const commissionRate = game?.commission || 0;

    let totalCommission = 0;
    if (!game.payLater) {
      totalCommission = (game_amount * commissionRate) / 100;
    }

    // const totalCommission = (game_amount * commissionRate) / 100;

    // if(game){
    //   if(game.payLater)
    // }

    // Step 4: Create the booking with generated Booking ID
    const newBooking = await Booking.create({
      booking_id: bookingId,
      booking_type,
      cafe: req.body.cafe,
      customer_id,
      game_id,
      slot_id,
      slot_date,
      status: mode === "Online" ? "Pending" : "Paid",
      total,
      paid_amount,
      players: customerIds,
      mode,
      playerCredits,
      custom_slot,
      txn_id,
      commission: totalCommission,
      game_amount,
    });

    if (playerCredits && playerCredits.length > 0) {
      const creditUpdatePromises = playerCredits.map((player) => {
        return Customer.findByIdAndUpdate(
          player.id,
          {
            $inc: { creditAmount: player.credit },
            $set: {
              txn_id: player.txn_id || null,
              last_payment_mode: player.payment_mode || "cash",
            },
          },
          { new: true }
        );
      });

      await Promise.all(creditUpdatePromises);
    }

    if (items.length > 0) {
      let pending_qty = req.body.items.reduce(
        (sum, item) => sum + parseInt(item.quantity),
        0
      );

      // Generate SO Number
      const lastSo = await InvSo.findOne().sort({ createdAt: -1 });
      let nextSoNumber = 1;
      if (lastSo) {
        const lastNumber = parseInt(lastSo.so_no.split("-")[1], 10);
        nextSoNumber = lastNumber + 1;
      }
      const so_no = `SO-${nextSoNumber.toString().padStart(3, "0")}`;
      const itemTotals = req.body.items.reduce(
        (sum, item) => sum + parseFloat(item.total || 0),
        0
      );

      const newSo = new InvSo({
        cafe: req.body.cafe,
        customer_id: req.body.customer_id || null,
        refer_id: newBooking._id,
        so_no,
        date: new Date(),
        shipment_date: new Date(),
        items: req.body.items.map((item) => item.id),
        subtotal: itemTotals || 0,
        total: itemTotals,
        pending_qty,
        type: "SO",
      });

      const savedSo = await newSo.save();

      // Save items in BookItem collection
      const bookItemIds = await Promise.all(
        req.body.items.map(async (product) => {
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

      // ✅ Update the booking with refer_id = SO._id
      await Booking.findByIdAndUpdate(newBooking._id, {
        so_id: savedSo._id,
      });
    }

    if (mode === "Offline" && status === "Paid") {
      await CreditTransaction.create({
        customer: customer_id,
        bookings: [newBooking._id],
        amount: total,
        payment_mode: "Cash",
        txn_id: txn_id || "Cash",
      });
    }

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

const updateBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const updateData = { ...req.body };

    const existingBooking = await Booking.findById(bookingId).lean();

    if (!existingBooking) {
      return res.status(404).json({
        status: "Failed to update booking",
        message: "Booking not found",
      });
    }

    const game = await Game.findById(existingBooking.game_id).lean();

    if (updateData.game_amount) {
      updateData.commission = Math.round(
        updateData.game_amount * (game.commission / 100)
      );
    }

    if (req.body.players) {
      updateData.players = req.body.players.map((player) => player.id);
    }

    if (req.body.game_amount) {
      updateData.game_amount = req.body.game_amount;
    }

    const booking = await Booking.findByIdAndUpdate(bookingId, updateData, {
      new: true,
      runValidators: true,
    });

    if (updateData.playerCredits && updateData.playerCredits.length > 0) {
      const creditUpdatePromises = updateData.playerCredits.map(
        async (player) => {
          await Customer.findByIdAndUpdate(
            player.id,
            {
              $inc: { creditAmount: player.credit },
              $set: {
                txn_id: player.txn_id || null,
                last_payment_mode: player.payment_mode || "cash",
              },
            },
            { new: true }
          );

          try {
            const creditData = await Credits.create({
              booking_id: bookingId,
              customer_id: player.id,
              amount: player.credit,
              txn_id: "",
              status: "Unpaid",
            });

            if (player.credit === 0) {
              await CreditTransaction.create({
                customer: player.id,
                bookings: [bookingId],
                amount: player.share,
                payment_mode: "Cash",
              });
            }
          } catch (err) {
            console.error("Failed to create credit:", err.message);
          }
        }
      );

      await Promise.all(creditUpdatePromises);
    }

    if (updateData.items) {
      let pending_qty = req.body.items.reduce(
        (sum, item) => sum + parseInt(item.quantity),
        0
      );

      // Generate SO Number
      const lastSo = await InvSo.findOne().sort({ createdAt: -1 });
      let nextSoNumber = 1;
      if (lastSo) {
        const lastNumber = parseInt(lastSo.so_no.split("-")[1], 10);
        nextSoNumber = lastNumber + 1;
      }
      const so_no = `SO-${nextSoNumber.toString().padStart(3, "0")}`;

      const newSo = new InvSo({
        cafe: req.body.cafe,
        customer_id: req.body.customer_id || null,
        refer_id: newBooking._id,
        so_no,
        date: new Date(),
        shipment_date: new Date(),
        items: req.body.items.map((item) => item.id),
        subtotal: req.body.total || 0,
        total: req.body.total,
        pending_qty,
        type: "SO",
      });

      const savedSo = await newSo.save();

      // Save items in BookItem collection
      const bookItemIds = await Promise.all(
        req.body.items.map(async (product) => {
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

      // ✅ Update the booking with refer_id = SO._id
      await Booking.findByIdAndUpdate(bookingId, {
        refer_id: savedSo._id,
      });

      return res.status(201).json({
        status: true,
        message: "Sales Order created successfully",
        data: savedSo,
      });
    }

    // mode: "Offline",
    //     status: "Paid",
    //     total: total,
    //     paid_amount: currentTotal,
    //     playerCredits: formattedPlayers,
    //     looserPlayer: looserPlayer,
    //     adjustment,
    //     game_amount: gameTotal

    await CreditTransaction.create({
      bookings: [existingBooking._id],
      customer: existingBooking.customer_id,
      amount: updateData.paid_amount,
      mode: "Cash"
    });

    if (!booking) {
      return res.status(404).json({
        status: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Booking details updated successfully",
      data: booking,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: "Failed to update booking details",
      error: err.message,
    });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, {
      status: "Cancelled",
    });

    if (booking && booking.so_id) {
      await InvSo.findOneAndUpdate(
        { refer_id: req.params.id },
        { status: "Cancelled" }
      );
    }

    if (!booking) {
      return res.status(404).json({
        status: false,
        message: "Booking not found",
      });
    }

    res.status(204).json({
      status: true,
      message: "Booking deleted successfully",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: "Failed to delete booking",
      error: err.message,
    });
  }
};

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ cafe: req.params.id })
      .populate("cafe", "name location")
      .populate("customer_id", "name email")
      .populate("game_id", "name price payLater start_time end_time")
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

const getBookingsByGame = async (req, res) => {
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
      booking_id,
      amount,
      paid_amount,
      total,
      looser,
      playerCredits,
      items,
      adjustment,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZOR_LIVE_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // Save transaction to DB
      const transaction = await Transaction.create({
        booking_id,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        amount,
        status: "Success",
      });

      // Update booking with transaction ID
      await Booking.findByIdAndUpdate(booking_id, {
        transaction: transaction._id,
        status: "Paid",
        mode: "Online",
        total: total,
        paid_amount: paid_amount,
        looser: looser,
        adjustment: adjustment,
        playerCredits: playerCredits,
        // payment_id: razorpay_payment_id,
      });

      await CreditTransaction.create({
        bookings: [booking_id],
        customer: req.body.customer_id,
        amount: amount / 100,
        mode: "Online",
        txn_id: razorpay_payment_id,
      });

      if (playerCredits && playerCredits.length > 0) {
        // Check if playerCredits is populated
        const creditUpdatePromises = playerCredits.map(async (player) => {
          if (!player.id || !player.credit) return; // Skip if data is incomplete

          await Customer.findByIdAndUpdate(
            player.id,
            {
              $inc: { creditAmount: player.credit },
              $set: {
                txn_id: player.txn_id || null,
                last_payment_mode: player.payment_mode || "cash",
              },
            },
            { new: true }
          );

          try {
            const creditData = await Credits.create({
              booking_id: booking_id,
              customer_id: player.id,
              amount: player.credit,
              txn_id: "",
              status: "Unpaid",
            });
          } catch (err) {
            console.error("Failed to create credit:", err.message);
          }
        });

        await Promise.all(creditUpdatePromises); // Ensure all credit updates are processed
      }

      if (items) {
        let pending_qty = req.body.items.reduce(
          (sum, item) => sum + parseInt(item.quantity),
          0
        );

        // Generate SO Number
        const lastSo = await InvSo.findOne().sort({ createdAt: -1 });
        let nextSoNumber = 1;
        if (lastSo) {
          const lastNumber = parseInt(lastSo.so_no.split("-")[1], 10);
          nextSoNumber = lastNumber + 1;
        }
        const so_no = `SO-${nextSoNumber.toString().padStart(3, "0")}`;

        const newSo = new InvSo({
          cafe: req.body.cafe,
          customer_id: req.body.customer_id || null,
          refer_id: newBooking._id,
          so_no,
          date: new Date(),
          shipment_date: new Date(),
          items: req.body.items.map((item) => item.id),
          subtotal: req.body.total || 0,
          total: req.body.total,
          pending_qty,
          type: "SO",
        });

        const savedSo = await newSo.save();

        // Save items in BookItem collection
        const bookItemIds = await Promise.all(
          req.body.items.map(async (product) => {
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

        // ✅ Update the booking with refer_id = SO._id
        await Booking.findByIdAndUpdate(newBooking._id, {
          refer_id: savedSo._id,
        });

        return res.status(201).json({
          status: true,
          message: "Sales Order created successfully",
          data: savedSo,
        });
      }

      res.json({ success: true, message: "Payment verified", transaction });
    } else {
      res.status(400).json({ status: false, message: "Invalid Signature" });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const startBookingTimer = async (req, res) => {
  try {
    const id = req.params.id;
    const booking = await Booking.findOne({ _id: id });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.timer_status === "Running") {
      return res.status(400).json({ message: "Timer already running" });
    }

    const now = new Date();
    await Booking.findByIdAndUpdate(booking._id, {
      start_time: now,
      timer_status: "Running",
      paused_time: 0, // Reset paused time
    });

    res.json({ message: "Timer started", start_time: now });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const pauseBookingTimer = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findOne({ _id: id });

    if (!booking || booking.timer_status !== "Running") {
      return res.status(400).json({ message: "Timer is not running" });
    }

    const now = new Date();
    const elapsedSeconds = Math.floor(
      (now - new Date(booking.start_time)) / 1000
    );

    await Booking.findByIdAndUpdate(booking._id, {
      timer_status: "Paused",
      paused_time: elapsedSeconds, // Store elapsed time
    });

    res.json({ message: "Timer paused", paused_time: elapsedSeconds });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resumeBookingTimer = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findOne({ _id: id });

    if (!booking || booking.timer_status !== "Paused") {
      return res.status(400).json({ message: "Timer is not paused" });
    }

    const now = new Date();
    const newStartTime = new Date(now.getTime() - booking.paused_time * 1000); // Adjust for paused duration

    await Booking.findByIdAndUpdate(booking._id, {
      timer_status: "Running",
      start_time: newStartTime, // Continue from the adjusted time
      paused_time: 0, // Reset paused time
    });

    res.json({ message: "Timer resumed", start_time: newStartTime });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const stopBookingTimer = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findOne({ _id: id });

    if (!booking || booking.timer_status === "Stopped") {
      return res.status(400).json({ message: "Timer is not running" });
    }

    const now = new Date();
    const elapsedSeconds =
      booking.paused_time ||
      Math.floor((now - new Date(booking.start_time)) / 1000);

    const pricePerHour = 100;
    const totalPrice = Math.round((elapsedSeconds / 3600) * pricePerHour);

    await Booking.findByIdAndUpdate(booking._id, {
      timer_status: "Stopped",
      end_time: now,
      total_time: elapsedSeconds,
      total: totalPrice,
    });

    res.json({ message: "Timer stopped", total_price: totalPrice });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBookingsBySlotDate = async (req, res) => {
  try {
    const { cafeId, slotDate } = req.params; // Get cafe ID and slot date from request parameters

    if (!slotDate) {
      return res.status(400).json({
        status: false,
        message: "Slot date is required",
      });
    }

    // Convert slotDate to a proper Date format and match any bookings within that day
    const startOfDay = new Date(slotDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(slotDate);
    endOfDay.setHours(23, 59, 59, 999);

    const bookings = await Booking.find({
      cafe: cafeId,
      slot_date: { $gte: startOfDay, $lte: endOfDay }, // Filter by slot_date within the given day
    })
      .populate("cafe", "name location")
      .populate("customer_id", "name email")
      .populate("game_id", "name price")
      .populate("slot_id", "start_time end_time")
      .populate("players", "name")
      .sort({ createdAt: -1 })
      .lean();

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
      message: "Bookings by date fetched successfully",
      results: mergedBookings.length,
      data: mergedBookings,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

const addToCart = async (req, res) => {
  try {
    const { items, customer_id, cafe } = req.body;
    const { id: bookingId } = req.params;

    let salesOrder = await InvSo.findOne({ refer_id: bookingId });

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ 
        status: false,
        message: "Booking not found" 
      });
    }

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        status: false,
        message: "Invalid items format" 
      });
    }

    if (items.length === 0) {
      // No items = Cancel Sales Order
      if (salesOrder) {
        await InvSo.deleteOne({ _id: salesOrder._id });

        // Also optionally unlink SO from booking if needed
        booking.so_id = null;
        await booking.save();

        return res.status(200).json({
          status: true,
          message: "Sales Order canceled successfully",
        });
      } else {
        return res.status(404).json({ 
          status: false,
          message: "No Sales Order to cancel" 
        });
      }
    }

    let total = 0;
    items.forEach((item) => {
      total += item.total;
    });

    const pending_qty = items.reduce(
      (sum, item) => sum + parseInt(item.quantity || 0),
      0
    );

    // Save BookItems
    const bookItemIds = await Promise.all(
      items.map(async (product) => {
        const bookItem = new BookItem({
          item_id: product.id,
          type: "SO",
          refer_id: salesOrder ? salesOrder._id : null,
          hsn: product.hsn || 0,
          quantity: product.quantity,
          price: product.price,
          tax: product.tax || null,
          tax_amt: product.tax_amt || 0,
          total: product.total,
        });
        const saved = await bookItem.save();
        return saved._id;
      })
    );

    if (salesOrder) {
      // Update existing SO
      salesOrder.items = bookItemIds;
      salesOrder.total = total;
      salesOrder.subtotal = total;
      salesOrder.pending_qty = pending_qty;
      await salesOrder.save();

      return res.status(200).json({
        status: true,
        message: "Sales Order updated successfully",
        data: salesOrder,
      });
    } else {
      // Generate new SO number
      const lastSo = await InvSo.findOne().sort({ createdAt: -1 });
      let nextSoNumber = 1;
      if (lastSo) {
        const lastNumber = parseInt(lastSo.so_no.split("-")[1], 10);
        nextSoNumber = lastNumber + 1;
      }
      const so_no = `SO-${nextSoNumber.toString().padStart(3, "0")}`;

      // Create new SO
      const newSo = new InvSo({
        cafe,
        customer_id: customer_id || null,
        refer_id: bookingId,
        so_no,
        date: new Date(),
        shipment_date: new Date(),
        items: bookItemIds,
        subtotal: total,
        total: total,
        pending_qty,
        type: "SO",
      });

      const savedSo = await newSo.save();

      // Link the new SO to the booking
      booking.so_id = savedSo._id;
      await booking.save();

      return res.status(201).json({
        status: true,
        message: "Sales Order created successfully",
        data: savedSo,
      });
    }
  } catch (error) {
    console.error("Sales Order Error:", error);
    return res.status(500).json({ 
      status: false,
      message: error.message 
    });
  }
};

const generateReport = async (req, res) => {
  const { startDate, endDate, gameId, cafeId } = req.body;

  if (!startDate || !endDate || !cafeId) {
    return res
      .status(400)
      .json({
        status: false,
        message: "startDate, endDate, and cafeId are required" 
      });
  }

  try {
    const start = new Date(startDate);
    const end = new Date(endDate);

    end.setHours(23, 59, 59, 999); // Extend endDate to end of the day

    // If startDate and endDate are the same, adjust to fetch data for the entire day
    if (start.toDateString() === end.toDateString()) {
      start.setHours(0, 0, 0, 0); // Start of the day
      end.setHours(23, 59, 59, 999); // End of the day
    }

    // Fetch bookings in date range and specific cafe
    let query = {
      slot_date: { $gte: start, $lte: end },
      cafe: cafeId, // Only that cafe's bookings
    };

    if (gameId) {
      query.game_id = gameId; // if specific game requested
    }

    const bookings = await Booking.find(query);

    // Group data by date
    const report = {};
    const allGameIds = new Set();

    bookings.forEach((booking) => {
      const dateKey = booking.slot_date.toISOString().split("T")[0]; // 'YYYY-MM-DD'

      if (!report[dateKey]) {
        report[dateKey] = {
          date: dateKey,
          games: {},
          totalAmountPaid: 0,
        };
      }

      if (!report[dateKey].games[booking.game_id]) {
        report[dateKey].games[booking.game_id] = {
          count: 0,
          amountPaid: 0,
        };
      }

      report[dateKey].games[booking.game_id].count += 1;
      report[dateKey].games[booking.game_id].amountPaid += booking.paid_amount;
      report[dateKey].totalAmountPaid += booking.paid_amount;

      allGameIds.add(booking.game_id.toString());
    });

    // Fetch game names
    const games = await Game.find({
      _id: { $in: Array.from(allGameIds) },
    }).select("name");
    const gameIdToNameMap = {};
    games.forEach((game) => {
      gameIdToNameMap[game._id.toString()] = game.name;
    });

    // Replace game ids with game names in the report
    const finalData = Object.values(report).map((day) => {
      const games = {};

      Object.keys(day.games).forEach((gameId) => {
        const gameName = gameIdToNameMap[gameId] || "Unknown Game";
        games[gameName] = day.games[gameId];
      });

      return {
        ...day,
        games,
      };
    });

    res.status(200).json({
      success: true,
      message: "Report generated successfully",
      data: finalData,
    });
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createBooking,
  getBookingDetails,
  updateBooking,
  deleteBooking,
  getBookings,
  getBookingsByGame,
  getBookingsBySlotDate,
  payment,
  verifyPayment,
  startBookingTimer,
  pauseBookingTimer,
  resumeBookingTimer,
  stopBookingTimer,
  addToCart,
  generateReport,
};
