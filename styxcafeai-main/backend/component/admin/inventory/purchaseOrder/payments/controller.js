const BillPayment = require("./model");
const InvPo = require("../model");

const createPayment = async (req, res) => {
  try {
    const {
      cafe,
      bill_id,
      deposit_amount,
      mode,
      deposit_date,
      transaction_id,
      description,
    } = req.body;

    // ✅ Check if the bill exists
    const bill = await InvPo.findById(bill_id);
    if (!bill) {
      return res
        .status(404)
        .json({ status: false, message: "Purchaese Bill not found." });
    }

    // ✅ Create a new payment record
    const newPayment = new BillPayment({
      cafe,
      bill_id,
      deposit_amount,
      mode,
      deposit_date,
      transaction_id,
      description,
    });

    const savedPayment = await newPayment.save();

    bill.deposit_amount =
      (parseInt(bill.deposit_amount) || 0) + parseInt(deposit_amount);

    // ✅ Check if the invoice is fully paid
    if (bill.deposit_amount >= bill.total) {
      bill.status = "Paid";
    } else {
      bill.status = "Partially Paid";
    }

    await bill.save();

    return res.status(201).json({
      status: true,
      message: "Payment recorded successfully",
      data: savedPayment,
    });
  } catch (error) {
    console.error("Error creating payment:", error);
    return res.status(500).json({
      status: false,
      message: "Error creating payment",
      error: error.message,
    });
  }
};

const getBillPaymentList = async (req, res) => {
  const id = req.params.id;
  try {
    const paymentList = await BillPayment.find({ cafe: id }).populate(
      "bill_id",
      "po_no"
    );

    res.status(200).json({
      status: true,
      message: "Bill Payment list fetched successfully",
      results: paymentList.length,
      data: paymentList,
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed to fetch payment list",
      message: err.message,
    });
  }
};

const getPaymentListByBill = async (req, res) => {
  const id = req.params.id;
  try {
    const paymentList = await BillPayment.find({ bill_id: id });

    res.status(200).json({
      status: true,
      message: "Bill Payment list fetched successfully",
      results: paymentList.length,
      data: paymentList,
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed to fetch bill payment list",
      message: err.message,
    });
  }
};

module.exports = { createPayment, getPaymentListByBill, getBillPaymentList };
