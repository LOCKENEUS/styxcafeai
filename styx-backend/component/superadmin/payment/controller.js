const Payment = require("./model");

const createPayment = async (req, res) => {
  try {
    const { payment_id, booking_id, user_id, amount, method } = req.body;

    const newPayment = await Payment.create({
      payment_id,
      booking_id,
      user_id,
      amount,
      method,
    });

    res.status(201).json({
      status: true,
      message: "Payment created successfully",
      data: newPayment,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

const getPaymentDetails = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        status: false,
        message: "Payment details not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Payment details fetched successfully",
      data: payment,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

const updatePayment = async (req, res) => {
  try {
    const paymentId = req.params.id;
    const updateData = { ...req.body };

    const payment = await Payment.findByIdAndUpdate(paymentId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!payment) {
      return res.status(404).json({
        status: false,
        message: "Payment not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Paymen details updated successfully",
      data: payment,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { is_active: false, is_deleted: true },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({
        status: false,
        message: "Payment not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Payment marked as deleted",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find();

    res.status(200).json({
      status: true,
      message: "Payments data fetched successfully",
      results: payments.length,
      data: payments,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

module.exports = {
  createPayment,
  getPaymentDetails,
  updatePayment,
  deletePayment,
  getPayments,
};
