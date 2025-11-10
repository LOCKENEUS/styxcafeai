const Item = require("./model");
const InvBookitems = require("../purchaseOrder/bookItemModel");
const InvSo = require("../salesOrder/model");
const InvPo = require("../purchaseOrder/model"); // assuming for PB

const createItem = async (req, res) => {
  try {

    let itemImage
    if(req.file){
      itemImage = req.file.path
      .replace(/^.*[\\/](uploads[\\/])/, "uploads/")
      .replace(/\\/g, "/");
    }

    req.body.image = itemImage

    if(!req.body.manufacturer){
      req.body.manufacturer = null
    }

    if(!req.body.brand){
      req.body.brand = null
    }

    if(!req.body.preferredVendor){
      req.body.preferredVendor = null
    }

    if(!req.body.tax){
      req.body.tax = null
    }
    
    if(!req.body.referId){
      req.body.referId = null
    }

    if(!req.body.cafe){
      req.body.cafe = null
    }

    req.body.cafeSellingPrice = req.body.sellingPrice;

    const newItem = await Item.create(req.body);
    res.status(201).json({
      status: true,
      message: "Item created successfully",
      data: newItem,
    });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

const getItems = async (req, res) => {
  try {
    const { id } = req.params;

    const items = await Item.find({ cafe: id, is_active: true, is_deleted: false}).sort({ createdAt: -1 }).populate("tax");

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

const getItemById = async (req, res) => {
  try {
    const { id } = req.params;
 
    const item = await Item.findById(id);
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

    if(!req.body.manufacturer || req.body.manufacturer === "null"){
      req.body.manufacturer = null
    }

    if(!req.body.brand || req.body.brand === "null"){
      req.body.brand = null
    }

    if(!req.body.preferredVendor || req.body.preferredVendor === "null"){
      req.body.preferredVendor = null
    }

    if(!req.body.tax || req.body.tax === "null"){
      req.body.tax = null
    }

    let itemImage
    // Handle image uploads
    if(req.file){
      itemImage = req.file.path
      .replace(/^.*[\\/](uploads[\\/])/, "uploads/")
      .replace(/\\/g, "/");
    }

    req.body.image = itemImage
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedItem) {
      return res.status(404).json({ status: false, message: "Item not found" });
    }
    res.status(200).json({ status: true, message: "Item updated successfully", data: updatedItem });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndUpdate(req.params.id, {
      is_active: false,
      is_deleted: true,
    }, { new: true });
    if (!deletedItem) {
      return res.status(404).json({ status: false, message: "Item not found" });
    }
    res.status(200).json({ status: true, message: "Item deleted successfully" });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

const getTransactionsAndHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const transactions = await InvBookitems.find({
      item_id: id,
      type: { $in: ["PB", "SI"] }
    }).sort({ createdAt: -1 });

    const populatedTransactions = await Promise.all(transactions.map(async (txn) => {
      let referData = null;

      if (txn.type === "SI") {
        referData = await InvSo.findById(txn.refer_id);
      } else if (txn.type === "PB") {
        referData = await InvPo.findById(txn.refer_id);
      }

      // Determine quantity and description based on type
      let quantity = txn.qty;
      let description = "";

      switch (txn.type) {
        case 'PO':
          quantity = txn.quantity;
          description = 'Purchase order created';
          break;
        case 'PR':
          quantity = txn.qty_received;
          description = 'Order is received';
          break;
        case 'PB':
          quantity = txn.quantity;
          description = 'Received order bill created';
          break;
        case 'SO':
          quantity = txn.quantity;
          description = 'Sales order created';
          break;
        case 'SI':
          quantity = txn.quantity;
          description = 'Shipping invoice created';
          break;
        default:
          quantity = txn.quantity;
          description = '';
      }

      return {
        ...txn.toObject(),
        refer_data: referData,
        quantity,
        description,
      };
    }));

    res.status(200).json({
      status: true,
      message: "Transactions and history fetched successfully",
      data: populatedTransactions,
    });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

module.exports = { createItem, getItems, getItemById, updateItem, deleteItem, getTransactionsAndHistory };
