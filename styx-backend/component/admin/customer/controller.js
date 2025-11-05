const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Customer = require("./model");
const Booking = require("../booking/model");
const crypto = require("crypto");
const Transaction = require("../booking/payment.model");
const CreditTransaction = require("./CreditTransaction/model");

const createCustomer = async (req, res) => {
  try {
    const {
      cafe,
      name,
      email,
      contact_no,
      age,
      address,
      gender,
      country,
      state,
      city,
      creditEligibility,
      creditLimit,
      creditAmount,
    } = req.body;

    // Check if a customer with the same contact number already exists for the specified cafe
    const existingCustomer = await Customer.findOne({
      cafe,
      contact_no,
    });

    if (existingCustomer) {
      return res.status(409).json({
        status: false,
        message: `Customer with the same contact number already exists for the cafe "${cafe}".`,
      });
    }

    let customerProfile;
    // Handle image uploads
    if (req.file) {
      customerProfile = req.file.path
        .replace(/^.*[\\/](uploads[\\/])/, "uploads/")
        .replace(/\\/g, "/");
    }

    const newCustomer = await Customer.create({
      cafe,
      name,
      email,
      contact_no,
      age,
      address,
      gender,
      customerProfile,
      country,
      state,
      city,
      creditEligibility,
      creditLimit,
      creditAmount,
    });

    res.status(201).json({
      status: true,
      message: "Customer created successfully",
      data: newCustomer,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({
      is_active: true,
      is_deleted: false,
      cafe: req.params.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      message: "Customers fetched successfully",
      count: customers.length,
      data: customers,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

const searchCustomers = async (req, res) => {
  try {
    const { search } = req.query; // Search input from query params
    const filter = {
      is_active: true,
      is_deleted: false,
      cafe: req.params.id,
    };

    // Search condition: Trigger only if input has 3 or more characters
    if (search && search.length >= 3) {
      filter.name = { $regex: search, $options: "i" }; // Case-insensitive search
    }

    const customers = await Customer.find(filter);

    res.status(200).json({
      status: true,
      message: "Customers fetched successfully",
      count: customers.length,
      data: customers,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findById(id).populate(
      "cafe",
      "name location"
    );

    if (!customer) {
      return res.status(404).json({
        status: false,
        message: "Customer not found",
      });
    }

    const bookings = await Booking.find({ customer_id: id })
      .populate("cafe", "name location")
      .populate("customer_id", "name email")
      .populate("game_id", "name price")
      .populate("slot_id", "start_time end_time")
      .populate("players", "name")
      .sort({ createdAt: -1 })
      .lean();

    const creditHistory = await Booking.find({
      playerCredits: {
        $elemMatch: {
          id: id, // id = customer_id
          credit: { $gt: 0 },
        },
      },
    })
      .populate("game_id", "name")
      .populate("slot_id", "start_time end_time")
      .sort({ createdAt: -1 })
      .lean();

    const filteredCredits = [];

    creditHistory.forEach((booking) => {
      booking.playerCredits.forEach((pc) => {
        if (pc.id.toString() === id.toString() && pc.credit > 0) {
          filteredCredits.push({
            booking_no: booking.booking_id,
            booking_id: booking._id,
            game_name: booking.game_id.name,
            slot: booking.slot_id,
            total: booking.total,
            slot_date: booking.slot_date,
            credit: pc.credit,
            paid_amount: pc.paid_amount,
            status: pc.status,
            payment_mode: pc.payment_mode,
          });
        }
      });
    });

    const creditTransaction = await CreditTransaction.find({
      customer: id,
    })
      .populate("customer", "name")
      .populate({
        path: "bookings",
        select: "booking_id", // or whatever fields you want from Booking
      })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      status: true,
      message: "Customer fetched successfully",
      data: customer,
      bookings,
      creditHistory: filteredCredits,
      creditTransaction,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const custId = req.params.id;
    const updateData = { ...req.body };

    if (req.file) {
      updateData.customerProfile = req.file.path
        .replace(/^.*[\\/](uploads[\\/])/, "uploads/")
        .replace(/\\/g, "/");
    }

    const customer = await Customer.findByIdAndUpdate(custId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!customer) {
      return res.status(404).json({
        status: false,
        message: "Customer not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Customer updated successfully",
      data: customer,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { is_active: false, is_deleted: true },
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({
        status: false,
        message: "Customer not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Customer marked as deleted",
      data: customer,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

const collectCreditAmount = async (req, res) => {
  try {
    const customerId = req.params.id;
    const { bookingIds } = req.body; // Expects: { bookingIds: [id1, id2, ...] }

    if (!Array.isArray(bookingIds) || bookingIds.length === 0) {
      return res
        .status(400)
        .json({
          status: false,
          message: "No booking IDs provided"
        });
    }

    // Fetch bookings by IDs
    const bookings = await Booking.find({ _id: { $in: bookingIds } });

    let updatedCount = 0;
    let collectedAmount = 0;

    for (const booking of bookings) {
      let updated = false;

      booking.playerCredits = booking.playerCredits.map((pc) => {
        if (pc.id.toString() === customerId.toString() && pc.credit > 0) {
          updated = true;
          collectedAmount += pc.credit;
          return {
            ...pc,
            credit: pc.credit,
            paid_amount: pc.credit,
            status: "Paid",
            payment_mode: "cash",
            txn_id: null,
            updatedAt: new Date(),
            paymentDate: new Date(),
          };
        }
        return pc;
      });

      if (updated) {
        await booking.save();
        updatedCount++;
      }
    }

    const creditTransaction = await CreditTransaction.create({
      customer: customerId,
      bookings: bookingIds,
      amount: collectedAmount,
      mode: "Cash",
    });

    await Customer.findByIdAndUpdate(customerId, {
      $inc: { creditAmount: -collectedAmount },
    });

    return res.status(200).json({
      status: true,
      message: `${updatedCount} bookings updated successfully.`,
    });
  } catch (error) {
    console.error("Error in collectCreditAmount:", error);
    return res.status(500).json({
      status: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

const collectCreditOnline = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingIds,
      amount,
    } = req.body;

    const customerId = req.params.id;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZOR_LIVE_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {

      // Fetch bookings by IDs
      const bookings = await Booking.find({ _id: { $in: bookingIds } });

      let updatedCount = 0;
      let collectedAmount = 0;

      for (const booking of bookings) {
        let updated = false;

        booking.playerCredits = booking.playerCredits.map((pc) => {
          if (pc.id.toString() === customerId.toString() && pc.credit > 0) {
            collectedAmount += pc.credit;
            updated = true;
            return {
              ...pc,
              credit: pc.credit,
              paid_amount: pc.credit,
              status: "Paid",
              payment_mode: "online",
              txn_id: razorpay_payment_id,
              updatedAt: new Date(),
              paymentDate: new Date(),
            };
          }
          return pc;
        });

        if (updated) {
          await booking.save();
          updatedCount++;
        }
      }

      await CreditTransaction.create({
        customer: customerId,
        bookings: bookingIds,
        amount: collectedAmount,
        mode: "Online",
        txn_id: razorpay_payment_id,
      });

      await Customer.findByIdAndUpdate(customerId, {
        $inc: { creditAmount: -collectedAmount },
      });

      res.json({
        stats: true,
        message: "Payment verified",
      });
    } else {
      res.status(400).json({
        status: false,
        message: "Invalid Signature"
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

const partialCollectCreditAmount = async (req, res) => {
  try {
    const customerId = req.params.id;
    let { amount } = req.body;

    if (!amount || amount <= 0) {
      return res
        .status(400)
        .json({
          status: false,
          message: "Invalid amount provided"
        });
    }

    // Find bookings where this customer has pending credit
    const bookings = await Booking.find({
      playerCredits: {
        $elemMatch: { id: customerId, credit: { $gt: 0 }, status: "Unpaid" },
      },
    }).sort({ slot_date: 1 });

    if (bookings.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No pending credits found for this customer",
      });
    }

    let remainingAmount = amount;
    let updatedBookings = [];

    for (const booking of bookings) {
      let updated = false;

      booking.playerCredits = booking.playerCredits.map((pc) => {
        if (
          pc.id.toString() === customerId.toString() &&
          pc.status !== "Paid" &&
          remainingAmount > 0
        ) {
          const creditToClear = Math.min(pc.credit, remainingAmount);
          pc.paid_amount += creditToClear;
          pc.status = pc.credit === creditToClear ? "Paid" : "Unpaid";
          pc.payment_mode = "cash";
          pc.txn_id = null;
          pc.updatedAt = new Date();
          pc.paymentDate = new Date();
          remainingAmount -= creditToClear;
          updated = true;
        }
        return pc;
      });

      if (updated) {
        await booking.save();
        updatedBookings.push(booking._id);
      }

      if (remainingAmount <= 0) break;
    }

    // Create a credit transaction record
    const creditTransaction = await CreditTransaction.create({
      customer: customerId,
      bookings: updatedBookings,
      amount: amount - remainingAmount,
      mode: "Cash",
    });

    await Customer.findByIdAndUpdate(customerId, {
      $inc: { creditAmount: -amount + remainingAmount },
    });

    return res.status(200).json({
      status: true,
      message: `${amount - remainingAmount} amount collected.`,
      data: {
        usedAmount: amount - remainingAmount,
        remainingAmount,
        updatedBookings,
      }
    });
  } catch (error) {
    console.error("Error in partialCollectCreditAmount:", error);
    return res.status(500).json({
      status: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

const collectPartialCreditOnline = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
    } = req.body;

    const customerId = req.params.id;

    if (!amount || amount <= 0) {
      return res
        .status(400)
        .json({
          status: false,
          message: "Invalid amount provided"
        });
    }

    // Verify Razorpay signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZOR_LIVE_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid Signature" });
    }

    // Get bookings with pending credits
    const bookings = await Booking.find({
      playerCredits: { $elemMatch: { id: customerId, credit: { $gt: 0 }, status: "Unpaid" } },
    }).sort({ slot_date: 1 });

    if (bookings.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No pending credits found for this customer",
      });
    }

    let remainingAmount = amount;
    let updatedBookings = [];

    for (const booking of bookings) {
      let updated = false;

      /**
       * if (
          pc.id.toString() === customerId.toString() &&
          pc.status !== "Paid" &&
          remainingAmount > 0
        ) {
          const creditToClear = Math.min(pc.credit, remainingAmount);
          pc.paid_amount += creditToClear;
          pc.status = pc.credit === creditToClear ? "Paid" : "Unpaid";
          pc.payment_mode = "cash";
          pc.txn_id = null;
          pc.updatedAt = new Date();
          pc.paymentDate = new Date();
          remainingAmount -= creditToClear;
          updated = true;
        }
       * 
       */

      booking.playerCredits = booking.playerCredits.map((pc) => {
        if (
          pc.id.toString() === customerId.toString() &&
          pc.status !== "Paid" &&
          remainingAmount > 0
        ) {
          const creditToClear = Math.min(pc.credit, remainingAmount);
          pc.paid_amount += creditToClear;
          pc.status = pc.credit === creditToClear ? "Paid" : "Unpaid";
          pc.payment_mode = "online";
          pc.txn_id = razorpay_payment_id;
          pc.updatedAt = new Date();
          pc.paymentDate = new Date();
          remainingAmount -= creditToClear;
          updated = true;
        }
        return pc;
      });

      if (updated) {
        await booking.save();
        updatedBookings.push(booking._id);
      }

      if (remainingAmount <= 0) break;
    }

    // Create a credit transaction record
    await CreditTransaction.create({
      customer: customerId,
      bookings: updatedBookings,
      amount: amount - remainingAmount,
      mode: "Online",
      txn_id: razorpay_payment_id,
    });

    await Customer.findByIdAndUpdate(customerId, {
      $inc: { creditAmount: -amount + remainingAmount },
    });

    return res.status(200).json({
      status: true,
      message: `${amount - remainingAmount} amount collected online.`,
      data: {
      usedAmount: amount - remainingAmount,
      remainingAmount,
      updatedBookings,
      }
    });
  } catch (error) {
    console.error("Error in collectPartialCreditOnline:", error);
    return res.status(500).json({
      status: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  searchCustomers,
  collectCreditAmount,
  collectCreditOnline,
  partialCollectCreditAmount,
  collectPartialCreditOnline,
};