const { default: mongoose } = require("mongoose");
const Item = require("../../../admin/inventory/item/model");
const BookItem = require("../../../admin/inventory/purchaseOrder/bookItemModel");
const InvPo = require("../../../admin/inventory/purchaseOrder/model");
const { Mongoose } = require("mongoose");

const createItem = async (req, res) => {
  try {
    let itemImage;
    if (req.file) {
      itemImage = req.file.path
        .replace(/^.*[\\/](uploads[\\/])/, "uploads/")
        .replace(/\\/g, "/");
    }

    req.body.image = itemImage;

    if (!req.body.manufacturer) {
      req.body.manufacturer = null;
    }

    if (!req.body.brand) {
      req.body.brand = null;
    }

    if (!req.body.preferredVendor) {
      req.body.preferredVendor = null;
    }

    if (!req.body.tax) {
      req.body.tax = null;
    }

    if (!req.body.referId) {
      req.body.referId = null;
    }

    if (!req.body.cafe) {
      req.body.cafe = null;
    }

    const newItem = await Item.create(req.body);
    res.status(201).json({
      status: true,
      message: "Superadmin item created successfully",
      data: newItem,
    });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

const getItems = async (req, res) => {
  try {
    const items = await Item.find({
      $or: [
        { cafe: null, referId: null },
        // { cafe: { $ne: null }, referId: { $ne: null } },
      ],
      is_active: true,
      is_deleted: false,
    })
      .sort({ createdAt: -1 })
      .populate("tax");

    res.status(200).json({
      status: true,
      message: "Superadmin items fetched successfully",
      results: items.length,
      data: items,
    });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

const getItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Item.findById(id)
      .populate("tax")
      .populate("manufacturer")
      .populate("brand")
      .populate("preferredVendor")
      .populate("cafe")
      .lean();

    const objectId = new mongoose.Types.ObjectId(id);

    const qty_to_receive_agg = await BookItem.aggregate([
      { $match: { item_id: objectId, type: "PO" } },
      // {
      //   $group: {
      //     _id: "$item_id",
      //     qty_to_receive: { $sum: "$quantity" },
      //   },
      // },
      {
        $group: {
          _id: "$item_id",
          qty_to_receive: {
            $sum: { $subtract: ["$quantity", "$qty_received"] },
          },
        },
      },
    ]);

    const qty_to_receive =
      qty_to_receive_agg.length > 0 ? qty_to_receive_agg[0].qty_to_receive : 0;

    const qty_to_bill_agg = await InvPo.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId("68357ea85ff937fa1e6cdfbd"), // PR _id
          type: "PR",
        },
      },
      // Lookup PR items
      {
        $lookup: {
          from: "bookitems",
          localField: "_id",
          foreignField: "refer_id",
          as: "pr_items",
        },
      },
      // Lookup PB documents referencing this PR
      {
        $lookup: {
          from: "invpos", // collection of PBs
          localField: "_id",
          foreignField: "refer_id",
          pipeline: [{ $match: { type: "PB" } }],
          as: "pb_docs",
        },
      },
      // Lookup PB items (from each PB doc)
      {
        $lookup: {
          from: "bookitems",
          let: { pbIds: "$pb_docs._id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ["$refer_id", "$$pbIds"] },
                    { $eq: ["$type", "PB"] },
                  ],
                },
              },
            },
          ],
          as: "pb_items",
        },
      },
      // Flatten PR items (if needed per item)
      {
        $unwind: "$pr_items",
      },
      {
        $addFields: {
          item_id: "$pr_items.item_id",
          qty_received: "$pr_items.qty_received",
        },
      },
      // Calculate total PB quantity for this item
      {
        $addFields: {
          pb_billed_qty: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$pb_items",
                    as: "pb_item",
                    cond: { $eq: ["$$pb_item.item_id", "$pr_items.item_id"] },
                  },
                },
                as: "matched",
                in: "$$matched.quantity",
              },
            },
          },
        },
      },
      {
        $project: {
          item_id: 1,
          qty_received: 1,
          pb_billed_qty: 1,
          qty_to_bill: { $subtract: ["$qty_received", "$pb_billed_qty"] },
        },
      },
    ]);

    const qty_to_bill =
      qty_to_bill_agg.length > 0 ? qty_to_bill_agg[0].qty_to_bill : 0;

    const qty_to_shipp_agg = await BookItem.aggregate([
      { $match: { item_id: objectId, type: "PACK" } },
      {
        $group: {
          _id: "$item_id",
          qty_to_ship: { $sum: "$qty_packed" },
        },
      },
    ]);

    const qty_to_ship =
      qty_to_shipp_agg.length > 0 ? qty_to_shipp_agg[0].qty_to_ship : 0;

    const order_qty = await BookItem.aggregate([
      { $match: { item_id: objectId, type: "SO" } },
      {
        $group: {
          _id: "$item_id",
          order_qty: { $sum: "$quantity" },
        },
      },
    ]);

    const invoiced_qty = await BookItem.aggregate([
      { $match: { item_id: objectId, type: "SINV" } },
      {
        $group: {
          _id: "$item_id",
          invoice_qty: { $sum: "$quantity" },
        },
      },
    ]);

    const qty_to_invoice =
      (order_qty[0]?.order_qty || 0) - (invoiced_qty[0]?.invoice_qty || 0);

    item.qty_to_receive = qty_to_receive;
    item.qty_to_bill = qty_to_bill;
    item.qty_to_ship = qty_to_ship;
    item.qty_to_invoice = qty_to_invoice;

    res.status(200).json({
      status: true,
      message: "Item details fetched successfully",
      data: item,
    });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

const updateItem = async (req, res) => {
  try {
    if (
      !req.body.manufacturer ||
      req.body.manufacturer === "null" ||
      req.body.manufacturer === "undefined"
    ) {
      req.body.manufacturer = null;
    }

    if (!req.body.brand || req.body.brand === "null") {
      req.body.brand = null;
    }

    if (!req.body.preferredVendor || req.body.preferredVendor === "null") {
      req.body.preferredVendor = null;
    }

    if (!req.body.tax || req.body.tax === "null") {
      req.body.tax = null;
    }

    let itemImage;
    // Handle image uploads
    if (req.file) {
      itemImage = req.file.path
        .replace(/^.*[\\/](uploads[\\/])/, "uploads/")
        .replace(/\\/g, "/");
    }

    req.body.image = itemImage;
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedItem) {
      return res.status(404).json({ status: false, message: "Item not found" });
    }
    res.status(200).json({
      status: true,
      message: "Item updated successfully",
      data: updatedItem,
    });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndUpdate(
      req.params.id,
      {
        is_active: false,
        is_deleted: true,
      },
      { new: true }
    );
    if (!deletedItem) {
      return res.status(404).json({ status: false, message: "Item not found" });
    }
    res
      .status(200)
      .json({ status: true, message: "Item deleted successfully" });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

const getTransactionsAndHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const transactions = await BookItem.find({
      item_id: id,
      type: { $in: ["PB", "SINV"] },
    }).sort({ createdAt: -1 });

    const populatedTransactions = await Promise.all(
      transactions.map(async (txn) => {
        let referData = null;

        if (txn.type === "SINV") {
          referData = await InvPo.findById(txn.refer_id);
        } else if (txn.type === "PB") {
          referData = await InvPo.findById(txn.refer_id);
        }

        // Determine quantity and description based on type
        let quantity = txn.qty;
        let description = "";

        switch (txn.type) {
          case "PO":
            quantity = txn.quantity;
            description = "Purchase order created";
            break;
          case "PR":
            quantity = txn.qty_received;
            description = "Order is received";
            break;
          case "PB":
            quantity = txn.quantity;
            description = "Received order bill created";
            break;
          case "SO":
            quantity = txn.quantity;
            description = "Sales order created";
            break;
          case "SINV":
            quantity = txn.quantity;
            description = "Shipping invoice created";
            break;
          default:
            quantity = txn.quantity;
            description = "";
        }

        return {
          ...txn.toObject(),
          refer_data: referData,
          quantity,
          description,
        };
      })
    );

    res.status(200).json({
      status: true,
      message: "Transactions and history fetched successfully",
      data: populatedTransactions,
    });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

module.exports = {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
  getTransactionsAndHistory,
};