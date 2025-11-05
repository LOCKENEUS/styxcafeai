const { default: mongoose } = require("mongoose");
const InvPo = require("../purchaseOrder/model");
const Item = require("../item/model");
const InvSo = require("../salesOrder/model");

const getDashboardData = async (req, res) => {
  try {
    const cafeId = req.AdminId;

    // Qty to receive
    const qtyToReceiveAgg = await InvPo.aggregate([
      {
        $match: {
          cafe: new mongoose.Types.ObjectId(cafeId),
          type: "PO",
          status: { $in: ["Draft", "Partially Received"] },
        },
      },
      {
        $group: {
          _id: null,
          qty_to_receive: { $sum: "$pending_qty" },
        },
      },
    ]);

    const qty_to_receive = qtyToReceiveAgg[0]?.qty_to_receive || 0;

    // qty received
    const qtyReceivedAgg = await InvPo.aggregate([
      {
        $match: {
          cafe: new mongoose.Types.ObjectId(cafeId),
          type: "PR",
          status: { $in: ["Draft"] },
        },
      },
      {
        $group: {
          _id: null,
          qty_received: { $sum: "$pending_qty" },
        },
      },
    ]);

    const qty_received = qtyReceivedAgg[0]?.qty_received || 0;

    // New Orders
    const newOrdersAgg = await InvPo.aggregate([
      {
        $match: {
          cafe: new mongoose.Types.ObjectId(cafeId),
          type: "PO",
          status: { $in: ["Draft"] },
        },
      },
      {
        $group: {
          _id: null,
          new_orders: { $sum: "$pending_qty" },
        },
      },
    ]);

    const new_orders = newOrdersAgg[0]?.new_orders || 0;

    // Total sale
    const totalSaleAgg = await InvSo.aggregate([
      {
        $match: {
          cafe: new mongoose.Types.ObjectId(cafeId),
          type: "SO",
        },
      },
      {
        $group: {
          _id: null,
          total_sale: { $sum: "$pending_qty" },
        },
      },
    ]);

    const total_sale = totalSaleAgg[0]?.total_sale || 0;

    // Total item stock
    const itemStockAgg = await Item.aggregate([
      {
        $match: {
          cafe: new mongoose.Types.ObjectId(cafeId),
        },
      },
      {
        $group: {
          _id: null,
          stock: { $sum: "$stock" },
        },
      },
    ]);

    const item_stock = itemStockAgg[0]?.stock || 0;

    return res.status(200).json({
      status: true,
      message: "Dashboard data fetched successfully",
      data: {
        qty_to_receive,
        qty_received,
        total_orders: qty_to_receive + qty_received,
        total_sale,
        new_orders,
        item_stock,
      },
    });
  } catch (err) {
    return res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

module.exports = { getDashboardData };
