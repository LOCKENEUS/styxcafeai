const InvPayment = require("./model");
const InvPo = require("../../../../admin/inventory/purchaseOrder/model");
const BillPayment = require("../../../../admin/inventory/purchaseOrder/payments/model");
const Cafe = require("../../../cafe/model");

const createPayment = async (req, res) => {
  try {
    const {
      invoice_id,
      deposit_amount,
      mode,
      deposit_date,
      transaction_id,
      description,
    } = req.body;

    // ✅ Check if the invoice exists
    const invoice = await InvPo.findById(invoice_id)
      .populate({
        path: "items",
        populate: {
          path: "item_id",
          model: "Item",
          select: "name description price hsn",
        },
      })
      .populate({
        path: "items",
        populate: {
          path: "tax",
          model: "Tax",
          select: "tax_name tax_rate",
        },
      });

    if (!invoice) {
      return res
        .status(404)
        .json({ status: false, message: "Invoice not found." });
    }

    // ✅ Create a new payment record
    const newPayment = new BillPayment({
      bill_id: invoice_id,
      deposit_amount,
      mode,
      deposit_date,
      transaction_id,
      description,
      cafe: null,
    });

    const savedPayment = await newPayment.save();

    invoice.deposit_amount =
      (parseInt(invoice.deposit_amount) || 0) + parseInt(deposit_amount);

    // reduce item stock based on the payment made
    invoice.items.forEach(async (item) => {
      const itemId = item.item_id;
      const quantity = item.quantity;

    //   // Update the stock of the item in the inventory
    //   await Item.findByIdAndUpdate(itemId, { $inc: { stock: -quantity } });
    });

    // ✅ Check if the invoice is fully paid
    if (invoice.deposit_amount >= invoice.total) {
      invoice.payment_status = "Paid";
    } else {
      invoice.payment_status = "Partially Paid";
    }

    await invoice.save();

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

const getPaymentList = async (req, res) => {
  try {
    const paymentList = await BillPayment.find({ cafe: null })
      .populate("bill_id")
      .lean();

    res.status(200).json({
      status: true,
      message: "Payment list fetched successfully",
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

const getPaymentListByInvoice = async (req, res) => {
  const id = req.params.id;
  try {
    const paymentList = await InvPayment.find({ invoice_id: id });

    res.status(200).json({
      status: true,
      message: "Payment list fetched successfully",
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

module.exports = { createPayment, getPaymentList, getPaymentListByInvoice };