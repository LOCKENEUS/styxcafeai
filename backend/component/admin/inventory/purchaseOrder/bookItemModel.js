const mongoose = require("mongoose");

const bookItemSchema = new mongoose.Schema(
  {
    item_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    type: { type: String, enum: ["PO", "SO", "PR", "PB", "SI", "PACK", "SHIP", "SINV", "RTN"], required: true },
    refer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InvPo",
      required: false,
    },
    hsn: { type: Number, default: 0 },
    quantity: { type: Number },
    qty_received: { type: Number, default: 0 },
    qty_packed: { type: Number, default: 0 },
    qty_shipped: { type: Number, default: 0 },  
    qty_returned: { type: Number, default: 0 },
    price: { type: Number, required: true },
    tax: { type: mongoose.Schema.Types.ObjectId, ref: "Tax", default: null },
    tax_amt: { type: Number, default: 0 },
    total: { type: Number, required: true },
    is_active: {
      type: Boolean,
      default: true,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const BookItem = mongoose.model("BookItem", bookItemSchema);

module.exports = BookItem;
