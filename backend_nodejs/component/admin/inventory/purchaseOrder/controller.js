const Item = require("../../inventory/item/model");
const InvPo = require("./model");
const BookItem = require("./bookItemModel");
const { default: mongoose } = require("mongoose");
const sendMail = require("../../../../utils/sendMail");
const { formatDate } = require("../../../../utils/utils");
const { Types } = require("mongoose");

// Create PO
const createPurchaseOrder = async (req, res) => {
  try {
    const requiredFields = ["items"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: false,
        message: "Required fields must be provided",
        errors: missingFields,
      });
    }

    let documents = [];
    if (req.files && req.files.length > 0) {
      documents = req.files.map((file) =>
        file.path
          .replace(/^.*[\\/](uploads[\\/])/, "uploads/")
          .replace(/\\/g, "/")
      );
    }

    if (req.body.user_type === "Superadmin") {
      req.body.vendor_id = null;
    }

    if (!req.body.refer_id) {
      req.body.refer_id = null;
    }

    if (!req.body.discount_type) {
      req.body.discount_type = "flat";
      req.body.discount_value = 0;
    }

    req.body.internal_team_file = documents;

    if (typeof req.body.items === "string") {
      req.body.items = JSON.parse(req.body.items);
    }

    if (typeof req.body.tax === "string") {
      req.body.tax = JSON.parse(req.body.tax);
    }

    const savedItems = [];
    if (req.body.items) {
      for (const item of req.body.items) {
        // Validate ObjectId format first
        if (!mongoose.Types.ObjectId.isValid(item.id)) {
          return res.status(400).json({
            status: false,
            message: `Invalid item ID format: ${item.id}. Please select valid items.`,
          });
        }
        
        const existingCafeItem = await Item.findById(item.id);
        if (!existingCafeItem) {
          return res.status(400).json({
            status: false,
            message: `Item with ID ${item.id} not found. Please select valid items from inventory.`,
          });
        }
        const existingPoItem = await Item.findOne({
          cafe: existingCafeItem.cafe,
          referId: item.id,
        });

        if (!existingCafeItem) {
          const newItem = new Item({
            cafe: req.body.cafe,
            name: existingItem.name,
            referId: item.id,
            sku: existingItem.sku,
            unit: existingItem.unit,
            hsn: existingItem.hsn,
            taxable: existingItem.taxable,
            tax: existingItem.tax,
            manufacturer: existingItem.manufacturer,
            brand: existingItem.brand,
            length: existingItem.length,
            width: existingItem.width,
            height: existingItem.height,
            weight: existingItem.weight,
            weightUnit: existingItem.weightUnit,
            dimensionUnit: existingItem.dimensionUnit,
            mpn: existingItem.mpn,
            upc: existingItem.upc,
            ean: existingItem.ean,
            isbn: existingItem.isbn,
            costPrice: existingItem.sellingPrice,
            sellingPrice: existingItem.cafeSellingPrice,
            preferredVendor: existingItem.preferredVendor,
            image: existingItem.image,
            description: existingItem.description,
            stock: 0,
          });

          await newItem.save();

          item.id = newItem._id;
          savedItems.push(newItem._id);
        }
      }
    }

    let pending_qty = req.body.items.reduce(
      (sum, item) => sum + parseInt(item.qty),
      0
    );

    const lastPo = await InvPo.findOne().sort({ createdAt: -1 });

    let nextPoNumber = 1;
    if (lastPo && lastPo.po_no) {
      const lastNumber = parseInt(lastPo.po_no.split("-")[1], 10);
      if (!isNaN(lastNumber)) {
        nextPoNumber = lastNumber + 1;
      }
    }

    while (true) {
      const po_no = `ORD-${nextPoNumber.toString().padStart(3, "0")}`;
      const existingPo = await InvPo.findOne({ po_no });

      if (!existingPo) {
        req.body.po_no = po_no;
        break;
      }
      nextPoNumber++;
    }

    const newPo = new InvPo({
      cafe: req.body.cafe,
      vendor_id: req.body.vendor_id,
      user_type: req.body.user_type,
      po_no: req.body.po_no,
      delivery_type: req.body.delivery_type,
      customer_id: req.body.customer_id || null,
      delivery_date: req.body.delivery_date,
      payment_terms: req.body.payment_terms,
      reference: req.body.reference || "",
      shipment_preference: req.body.shipment_preference || "",
      description: req.body.description || "",
      items: savedItems,
      subtotal: req.body.subtotal || 0,
      discount_value: req.body.discount_value || 0,
      discount_type: req.body.discount_type || "",
      tax: req.body.tax || [],
      total: req.body.total,
      adjustment_note: req.body.adjustment_note || "",
      adjustment_amount: req.body.adjustment_amount || 0,
      internal_team_notes: req.body.internal_team_notes || "",
      internal_team_file: req.body.internal_team_file || [],
      pending_qty,
      type: "PO",
    });

    const savedPo = await newPo.save();

    const bookItemIds = await Promise.all(
      req.body.items.map(async (product) => {
        const existingCafeItem = await Item.findOne({
          cafe: req.body.cafe,
          $or: [{ _id: product.id }, { referId: product.id }],
        });

        const bookItem = new BookItem({
          item_id: existingCafeItem ? existingCafeItem._id : product.id,
          type: "PO",
          refer_id: savedPo._id,
          hsn: product.hsn || 0,
          quantity: product.qty,
          price: product.price,
          tax: product.tax || null,
          tax_amt: product.tax_amt || 0,
          total: product.total,
        });
        const savedBookItem = await bookItem.save();
        return savedBookItem._id;
      })
    );

    savedPo.items = bookItemIds;
    await savedPo.save();

    return res.status(201).json({
      status: true,
      message: "Purchase order created successfully",
      data: savedPo,
    });
  } catch (err) {
    console.error("Error creating purchase order:", err);
    return res.status(500).json({
      status: false,
      message: "Error creating purchase order",
      error: err.message,
    });
  }
};

const getAllPurchaseOrders = async (req, res) => {
  const id = req.params.id;
  try {
    const purchaseOrders = await InvPo.find({ cafe: id, type: "PO" })
      .populate("vendor_id")
      .populate("customer_id")
      .populate({
        path: "items",
        populate: { path: "item_id" },
      })
      .populate("tax")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: true,
      message: "Purchase orders fetched successfully",
      data: purchaseOrders,
    });
  } catch (err) {
    console.error("Error fetching purchase orders:", err);
    return res.status(500).json({
      status: false,
      message: "Error fetching purchase orders",
      error: err.message,
    });
  }
};

const getCafePurchaseOrders = async (req, res) => {
  const id = req.params.id;
  try {
    const purchaseOrders = await InvPo.find({
      cafe: id,
      type: "PO",
      vendor_id: null,
      pending_qty: { $gt: 0 },
    })
      .populate("vendor_id")
      .populate("customer_id")
      .populate({
        path: "items",
        populate: { path: "item_id" },
      })
      .populate("tax")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: true,
      message: "Cafe PO fetched successfully",
      data: purchaseOrders,
    });
  } catch (err) {
    console.error("Error fetching cafe PO:", err);
    return res.status(500).json({
      status: false,
      message: "Error fetching cafe PO",
      error: err.message,
    });
  }
};

const getPurchaseOrdersByVendor = async (req, res) => {
  const { id, vendor_id } = req.params;
  try {
    const purchaseOrders = await InvPo.find({
      vendor_id: vendor_id,
      cafe: id,
      type: "PO",
      pending_qty: { $gt: 0 },
    })
      .populate("vendor_id")
      .populate("customer_id")
      .populate({
        path: "items",
        populate: { path: "item_id" },
      })
      .populate("tax");

    return res.status(200).json({
      status: true,
      message: "Purchase orders by vendor fetched successfully",
      data: purchaseOrders,
    });
  } catch (err) {
    console.error("Error fetching purchase orders:", err);
    return res.status(500).json({
      status: false,
      message: "Error fetching purchase orders",
      error: err.message,
    });
  }
};

const getPurchaseOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const purchaseOrder = await InvPo.findById(id)
      .populate("vendor_id")
      .populate("customer_id")
      .populate("payment_terms")
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
      })
      .populate("tax");

    purchaseOrder.items = purchaseOrder.items.map((item) => ({
      _id: item._id, // Include item's own _id
      ...item,
      item_id: {
        _id: item.item_id?._id, // Include populated item's _id
        ...item.item_id,
      },
    }));

    if (!purchaseOrder) {
      return res.status(404).json({
        status: false,
        message: "Purchase order not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Purchase order fetched successfully",
      data: purchaseOrder,
    });
  } catch (err) {
    console.error("Error fetching purchase order:", err);
    return res.status(500).json({
      status: false,
      message: "Error fetching purchase order",
      error: err.message,
    });
  }
};
const updatePurchaseOrder = async (req, res) => {
  try {
    const { id } = req.params;

    let purchaseOrder = await InvPo.findById(id);
    if (!purchaseOrder) {
      return res.status(404).json({
        status: false,
        message: "Purchase order not found",
      });
    }

    // Parse items & tax if they are stringified JSON
    if (typeof req.body.items === "string") {
      req.body.items = JSON.parse(req.body.items);
    }
    if (typeof req.body.tax === "string") {
      req.body.tax = JSON.parse(req.body.tax);
    }

    // Calculate pending quantity
    let pending_qty = req.body.items
      ? req.body.items.reduce((sum, item) => {
          const qty = item.qty !== undefined ? item.qty : (item.quantity !== undefined ? item.quantity : 0);
          return sum + parseInt(qty);
        }, 0)
      : purchaseOrder.pending_qty;

    // Update purchase order fields
    const updatedPurchaseOrder = await InvPo.findByIdAndUpdate(
      id,
      {
        cafe: req.body.cafe || purchaseOrder.cafe,
        vendor_id: req.body.vendor_id || purchaseOrder.vendor_id,
        delivery_type: req.body.delivery_type || purchaseOrder.delivery_type,
        customer_id: req.body.customer_id || purchaseOrder.customer_id,
        delivery_date: req.body.delivery_date || purchaseOrder.delivery_date,
        payment_terms: req.body.payment_terms || purchaseOrder.payment_terms,
        reference: req.body.reference || purchaseOrder.reference,
        shipment_preference:
          req.body.shipment_preference || purchaseOrder.shipment_preference,
        description: req.body.description || purchaseOrder.description,
        subtotal: req.body.subtotal || purchaseOrder.subtotal,
        discount_value: req.body.discount_value || purchaseOrder.discount_value,
        discount_type: req.body.discount_type || purchaseOrder.discount_type,
        tax: req.body.tax || purchaseOrder.tax,
        total: req.body.total || purchaseOrder.total,
        adjustment_note:
          req.body.adjustment_note || purchaseOrder.adjustment_note,
        adjustment_amount:
          req.body.adjustment_amount || purchaseOrder.adjustment_amount,
        internal_team_notes:
          req.body.internal_team_notes || purchaseOrder.internal_team_notes,
        pending_qty,
        type: req.body.type || purchaseOrder.type,
      },
      { new: true }
    );

    await BookItem.deleteMany({ refer_id: id, type: "PB" });
    const bookItemIds = req.body.items ? await Promise.all(
      req.body.items.map(async (product) => {
        const bookItem = new BookItem({
          item_id: product.id || product.item_id,
          type: "SO",
          refer_id: updatedPurchaseOrder._id,
          hsn: product.hsn || 0,
          quantity: product.qty !== undefined ? product.qty : (product.quantity !== undefined ? product.quantity : 0),
          price: product.price,
          tax: product.tax || null,
          tax_amt: product.tax_amt || 0,
          total: product.total,
        });
        const savedBookItem = await bookItem.save();
        return savedBookItem._id;
      })
    ) : [];

    updatedPurchaseOrder.items = bookItemIds;
    await updatedPurchaseOrder.save();

    return res.status(200).json({
      status: true,
      message: "Purchase order updated successfully",
      data: purchaseOrder,
    });
  } catch (err) {
    console.error("Error updating purchase order:", err);
    return res.status(500).json({
      status: false,
      message: "Error updating purchase order",
      error: err.message,
    });
  }
};

// Purchase Receive
const createPurchaseReceive = async (req, res) => {
  try {
    let { vendor_id, po_id, received_date, description, items } = req.body;
    let qtyToReceive = 0;

    // Fetch PO details
    const poDetails = await InvPo.findById(po_id).populate("items");
    if (!poDetails) {
      return res
        .status(404)
        .json({ status: false, message: "Purchase order not found." });
    }

    // Calculate quantity to receive
    items.forEach((item) => {
      qtyToReceive += parseInt(item.qty_to_receive, 10) || 0;
    });

    if (poDetails.pending_qty < qtyToReceive) {
      return res
        .status(400)
        .json({ status: false, message: "Quantity exceeds pending quantity." });
    }

    if (qtyToReceive === 0) {
      return res
        .status(400)
        .json({ status: false, message: "Quantity to receive is zero." });
    }

    if (vendor_id === "StyxCafe") {
      vendor_id = null;
    }

    // ✅ **Find the last PR number safely**
    const lastPr = await InvPo.findOne({ type: "PR" }).sort({ createdAt: -1 });
    let nextPrNumber = 1;
    if (lastPr && lastPr.po_no) {
      const lastPrNumber = parseInt(lastPr.po_no.split("-")[1], 10);
      nextPrNumber = lastPrNumber + 1;
    }
    const po_no = `PR-${String(nextPrNumber).padStart(3, "0")}`;

    // ✅ **Ensure unique `po_no` atomically**
    const existingPr = await InvPo.findOne({ po_no });
    if (existingPr) {
      return res.status(400).json({
        status: false,
        message: "PR number already exists, please retry.",
      });
    }

    // ✅ **Create Purchase Receive**
    const updatedPendingQty = poDetails.pending_qty - qtyToReceive;
    const purchaseReceive = new InvPo({
      cafe: poDetails.cafe,
      vendor_id,
      po_no,
      type: "PR",
      refer_id: po_id,
      delivery_date: received_date,
      description,
      items: [],
      pending_qty: updatedPendingQty,
      customer_id: undefined,
      tax: undefined,
    });

    const savedPr = await purchaseReceive.save();

    // ✅ **Save Book Items & Update Stock**
    const bookItemIds = await Promise.all(
      items.map(async (item) => {
        const bookItem = new BookItem({
          item_id: item.item_id,
          type: "PR",
          refer_id: savedPr._id,
          hsn: item.hsn || 0,
          quantity: item.quantity,
          price: item.price,
          tax: item.tax || null,
          tax_amt: item.tax_amt || 0,
          total: item.total,
          qty_received: item.qty_to_receive,
        });
        const savedBookItem = await bookItem.save();

        await Item.findByIdAndUpdate(item.item_id, {
          $inc: { stock: item.qty_to_receive },
        });

        await BookItem.findByIdAndUpdate(item._id, {
          $inc: { qty_received: item.qty_to_receive },
        });

        return savedBookItem._id;
      })
    );

    savedPr.items = bookItemIds;
    await savedPr.save();

    // ✅ **Update PO Pending Quantity**
    await InvPo.findByIdAndUpdate(po_id, {
      pending_qty: updatedPendingQty,
      status: updatedPendingQty === 0 ? "Received" : "Partially Received",
    });

    return res.status(201).json({
      status: true,
      message: "Purchase receive created successfully",
      data: savedPr,
    });
  } catch (error) {
    console.error("Error creating purchase receive:", error);
    return res.status(500).json({
      status: false,
      message: "Error creating purchase receive",
      error: error.message,
    });
  }
};
const getAllPurchaseReceives = async (req, res) => {
  const id = req.params.id;
  try {
    const purchaseReceives = await InvPo.find({ cafe: id, type: "PR" })
      .populate("vendor_id", "name")
      .populate("customer_id")
      .populate({
        path: "items",
        populate: {
          path: "item_id",
          model: "Item",
          select: "name description price",
        },
      })
      .populate("tax", "tax_name tax_rate")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: true,
      message: "Purchase Receives fetched successfully",
      data: purchaseReceives,
    });
  } catch (error) {
    console.error("Error fetching purchase receives:", error);
    return res.status(500).json({
      status: false,
      message: "Error fetching purchase receives",
      error: error.message,
    });
  }
};

// ✅ Get Purchase Receive Details by ID
const getPurchaseReceiveById = async (req, res) => {
  try {
    const { id } = req.params;
    const purchaseReceive = await InvPo.findById(id)
      .populate("vendor_id")
      .populate("customer_id")
      .populate({
        path: "items",
        populate: {
          path: "item_id",
          model: "Item",
          select: "name description price hsn sku",
        },
      })
      .populate({
        path: "items",
        populate: {
          path: "tax",
          model: "Tax",
          select: "tax_name tax_rate",
        },
      })
      .populate("tax", "tax_name tax_rate")
      .populate("refer_id", "delivery_date po_no delivery_type");

    if (!purchaseReceive) {
      return res.status(404).json({
        status: false,
        message: "Purchase Receive not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Purchase Receive details fetched successfully",
      data: purchaseReceive,
    });
  } catch (error) {
    console.error("Error fetching purchase receive details:", error);
    return res.status(500).json({
      status: false,
      message: "Error fetching purchase receive details",
      error: error.message,
    });
  }
};

// Purchase Bill
const createPurchaseBill = async (req, res) => {
  try {
    const requiredFields = ["items"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    let { vendor_id } = req.body;

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: false,
        message: "Required fields must be provided",
        errors: missingFields,
      });
    }

    if (!req.body.refer_id) {
      req.body.refer_id = null;
    }

    if (!vendor_id || vendor_id === "") {
      req.body.vendor_id = null;
    }

    let documents = [];
    if (req.files && req.files.length > 0) {
      documents = req.files.map((file) =>
        file.path
          .replace(/^.*[\\/](uploads[\\/])/, "uploads/")
          .replace(/\\/g, "/")
      );
    }

    if (!req.body.discount_type) {
      req.body.discount_type = "flat";
      req.body.discount_value = 0;
    }

    req.body.internal_team_file = documents;

    if (typeof req.body.items === "string") {
      req.body.items = JSON.parse(req.body.items);
    }

    if (typeof req.body.tax === "string") {
      req.body.tax = JSON.parse(req.body.tax);
    }

    let pending_qty = req.body.items.reduce(
      (sum, item) => sum + parseInt(item.qty),
      0
    );

    const lastPo = await InvPo.findOne().sort({ createdAt: -1 });

    let nextPoNumber = 1;
    if (lastPo && lastPo.po_no) {
      const lastNumber = parseInt(lastPo.po_no.split("-")[1], 10);
      if (!isNaN(lastNumber)) {
        nextPoNumber = lastNumber + 1;
      }
    }

    while (true) {
      const po_no = `PB-${nextPoNumber.toString().padStart(3, "0")}`;

      const existingPo = await InvPo.findOne({ po_no });

      if (!existingPo) {
        req.body.po_no = po_no;
        break;
      }

      nextPoNumber++;
    }

    const newPb = new InvPo({
      cafe: req.body.cafe,
      vendor_id: req.body.vendor_id,
      po_no: req.body.po_no,
      delivery_type: req.body.delivery_type,
      customer_id: req.body.customer_id || null,
      refer_id: req.body.refer_id || null,
      delivery_date: req.body.delivery_date,
      payment_terms: req.body.payment_terms,
      reference: req.body.reference || "",
      shipment_preference: req.body.shipment_preference || "",
      description: req.body.description || "",
      items: req.body.items.map((item) => item.id),
      subtotal: req.body.subtotal || 0,
      discount_value: req.body.discount_value || 0,
      discount_type: req.body.discount_type || "",
      tax: req.body.tax || [],
      total: req.body.total,
      adjustment_note: req.body.adjustment_note || "",
      adjustment_amount: req.body.adjustment_amount || 0,
      internal_team_notes: req.body.internal_team_notes || "",
      internal_team_file: req.body.internal_team_file || [],
      pending_qty,
      type: "PB",
    });

    const savedPb = await newPb.save();

    const bookItemIds = await Promise.all(
      req.body.items.map(async (product) => {
        const bookItem = new BookItem({
          item_id: product.id,
          type: "PB",
          refer_id: savedPb._id,
          hsn: product.hsn || 0,
          quantity: product.qty,
          price: product.price,
          tax: product.tax || null,
          tax_amt: product.tax_amt || 0,
          total: product.total,
        });
        const savedBookItem = await bookItem.save();
        return savedBookItem._id;
      })
    );

    savedPb.items = bookItemIds;
    await savedPb.save();

    return res.status(201).json({
      status: true,
      message: "Purchase order created successfully",
      data: savedPb,
    });
  } catch (err) {
    console.error("Error creating purchase bill:", err);
    return res.status(500).json({
      status: false,
      message: "Error creating purchase bill",
      error: err.message,
    });
  }
};

const getAllPurchaseBills = async (req, res) => {
  const id = req.params.id;
  try {
    const purchaseBills = await InvPo.find({ cafe: id, type: "PB" })
      .populate("vendor_id")
      .populate("customer_id")
      .populate({
        path: "items",
        populate: { path: "item_id" },
      })
      .populate("tax")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: true,
      message: "Purchase bills fetched successfully",
      data: purchaseBills,
    });
  } catch (err) {
    console.error("Error fetching purchase bills:", err);
    return res.status(500).json({
      status: false,
      message: "Error fetching purchase bills",
      error: err.message,
    });
  }
};

const updatePurchaseBill = async (req, res) => {
  try {
    const { id } = req.params;

    let purchaseBill = await InvPo.findById(id);
    if (!purchaseBill) {
      return res.status(404).json({
        status: false,
        message: "Purchase bill not found",
      });
    }

    // Parse items & tax if they are stringified JSON
    if (typeof req.body.items === "string") {
      req.body.items = JSON.parse(req.body.items);
    }
    if (typeof req.body.tax === "string") {
      req.body.tax = JSON.parse(req.body.tax);
    }

    // Calculate pending quantity
    let pending_qty = req.body.items
      ? req.body.items.reduce((sum, item) => sum + parseInt(item.qty), 0)
      : purchaseBill.pending_qty;

    // Update purchase order fields
    const updatedPurchaseBill = await InvPo.findByIdAndUpdate(
      id,
      {
        cafe: req.body.cafe || purchaseBill.cafe,
        vendor_id: req.body.vendor_id || purchaseBill.vendor_id,
        delivery_type: req.body.delivery_type || purchaseBill.delivery_type,
        customer_id: req.body.customer_id || purchaseBill.customer_id,
        delivery_date: req.body.delivery_date || purchaseBill.delivery_date,
        payment_terms: req.body.payment_terms || purchaseBill.payment_terms,
        reference: req.body.reference || purchaseBill.reference,
        shipment_preference:
          req.body.shipment_preference || purchaseBill.shipment_preference,
        description: req.body.description || purchaseBill.description,
        subtotal: req.body.subtotal || purchaseBill.subtotal,
        discount_value: req.body.discount_value || purchaseBill.discount_value,
        discount_type: req.body.discount_type || purchaseBill.discount_type,
        tax: req.body.tax || purchaseBill.tax,
        total: req.body.total || purchaseBill.total,
        adjustment_note:
          req.body.adjustment_note || purchaseBill.adjustment_note,
        adjustment_amount:
          req.body.adjustment_amount || purchaseBill.adjustment_amount,
        internal_team_notes:
          req.body.internal_team_notes || purchaseBill.internal_team_notes,
        pending_qty,
        type: req.body.type || purchaseBill.type,
      },
      { new: true }
    );

    await BookItem.deleteMany({ refer_id: id, type: "PB" });
    const bookItemIds = await Promise.all(
      req.body.items.map(async (product) => {
        const bookItem = new BookItem({
          item_id: product.id,
          type: "SO",
          refer_id: updatedPurchaseBill._id,
          hsn: product.hsn || 0,
          quantity: product.qty,
          price: product.price,
          tax: product.tax || null,
          tax_amt: product.tax_amt || 0,
          total: product.total,
        });
        const savedBookItem = await bookItem.save();
        return savedBookItem._id;
      })
    );

    updatedPurchaseBill.items = bookItemIds;
    await updatedPurchaseBill.save();

    return res.status(200).json({
      status: true,
      message: "Purchase bill updated successfully",
      data: purchaseBill,
    });
  } catch (err) {
    console.error("Error updating purchase bill:", err);
    return res.status(500).json({
      status: false,
      message: "Error updating purchase bill",
      error: err.message,
    });
  }
};

const getItemQuantities = async (req, res) => {
  const { id } = req.params;
  try {
    const objectId = new mongoose.Types.ObjectId(id);

    // Fetch total quantity for "PO" (Purchase Order)
    const poItemsCount = await BookItem.aggregate([
      { $match: { item_id: objectId, type: "PO" } },
      { $group: { _id: null, totalQuantity: { $sum: "$quantity" } } },
    ]);

    const totalQtyToReceive = poItemsCount.length
      ? poItemsCount[0].totalQuantity
      : 0;

    // Fetch total quantity for "PR" (Purchase Return)
    const prItemsCount = await BookItem.aggregate([
      { $match: { item_id: objectId, type: "PR" } },
      { $group: { _id: null, totalQuantity: { $sum: "$qty_received" } } },
    ]);

    const totalQtyToBill = prItemsCount.length
      ? prItemsCount[0].totalQuantity
      : 0;

    const toBeReceived = totalQtyToReceive - totalQtyToBill;

    const pbItemsCount = await BookItem.aggregate([
      { $match: { item_id: objectId, type: "PB" } },
      { $group: { _id: null, totalQuantity: { $sum: "$quantity" } } },
    ]);

    const totalBilledQty = pbItemsCount.length
      ? pbItemsCount[0].totalQuantity
      : 0;

    const toBeBilled = totalQtyToBill - totalBilledQty;

    // Fetch total quantity for "SO" (Sales Order)
    const soItemsCount = await BookItem.aggregate([
      { $match: { item_id: objectId, type: "SO" } },
      { $group: { _id: null, totalQuantity: { $sum: "$quantity" } } },
    ]);

    const totalQtyToSell = soItemsCount.length
      ? soItemsCount[0].totalQuantity
      : 0;

    // Fetch total quantity for "SI" (Sales Invoice)
    const siItemsCount = await BookItem.aggregate([
      { $match: { item_id: objectId, type: "SI" } },
      { $group: { _id: null, totalQuantity: { $sum: "$quantity" } } },
    ]);

    const totalQtyToInvoice = siItemsCount.length
      ? siItemsCount[0].totalQuantity
      : 0;

    const toBeInvoiced = totalQtyToSell - totalQtyToInvoice;

    return res.status(200).json({
      status: true,
      message: "Total quantity to receive fetched successfully",
      data: { toBeReceived, toBeBilled, toBeInvoiced },
    });
  } catch (error) {
    console.error("Error fetching quantity to receive:", error);
    return res.status(500).json({
      status: false,
      message: "Error fetching quantity to receive",
      error: error.message,
    });
  }
};

const sendMailToClient = async (req, res) => {
  try {
    const deliveryDate = new Date(req.body.delivery_date).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );

    let type,
      vendor,
      email,
      itemsStatus,
      shippingAddress,
      greetMessage,
      orderNo,
      queryMessage,
      orderDate,
      th1,
      th2;
    let note = true;

    if (req.body.type === "PO") {
      type = "Purchase Order";
      shippingAddress = req.body.vendor_id.shippingAddress;
      greetMessage = "Thank you for your order!";
      vendor = req.body.vendor_id.name;
      email = req.body.vendor_id.email;
      note = true;
      orderNo = req.body.po_no;
      queryMessage = "We will notify you once your order is shipped.";
      orderDate = formatDate(req.body.delivery_date);
      itemsStatus = "Ordered";
      th1 = "Quantity";
      th2 = "Price";
    } else if (req.body.type === "PR") {
      type = "Purchase Receive";
      vendor = req.body.vendor_id.name;
      email = req.body.vendor_id.email;
      shippingAddress = req.body.vendor_id.shippingAddress;
      greetMessage = "Your order has been received";
      note = false;
      orderNo = req.body.po_no;
      queryMessage = "We will notify you after inoice is generated.";
      orderDate = formatDate(req.body.delivery_date);
      itemsStatus = "Received";
      th1 = "Qty Ordered";
      th2 = "Qty Received";
    } else if (req.body.type === "PB") {
      type = "Bill";
      vendor = req.body.vendor_id.name;
      email = req.body.vendor_id.email;
      shippingAddress = req.body.vendor_id.shippingAddress;
      greetMessage = "Your order is received!";
      note = true;
      orderNo = req.body.po_no;
      queryMessage = "Thank you for your order!";
      orderDate = formatDate(req.body.delivery_date);
      itemsStatus = "Billed";
      th1 = "Qty Ordered";
      th2 = "Price";
    } else if (req.body.type === "SO") {
      type = "Sales Order";
      vendor = req.body.customer_id.name;
      email = req.body.customer_id.email;
      shippingAddress = req.body.customer_id.address;
      greetMessage = "Thank you for your order!";
      note = true;
      orderNo = req.body.so_no;
      queryMessage = "Thank you for your order!";
      orderDate = formatDate(req.body.date);
      itemsStatus = "Ordered";
      th1 = "Quantity";
      th2 = "Price";
    } else if (req.body.type === "SI") {
      type = "Invoice";
      vendor = req.body.customer_id.name;
      email = req.body.customer_id.email;
      shippingAddress = req.body.customer_id.address;
      greetMessage = "";
      note = true;
      orderNo = req.body.so_no;
      queryMessage = "Thank you for your order!";
      orderDate = formatDate(req.body.date);
      itemsStatus = "Ordered";
      th1 = "Quantity";
      th2 = "Price";
    }

    const mailSubject = `Your ${type} Status & Notification.`;

    const content = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Welcome Email</title>
<style>
  @media only screen and (max-width: 600px) {
    body, table, td, p {
      font-size: 13px !important;
    }
    .full-width {
      width: 100% !important;
    }
    .text-left {
      text-align: left !important;
    }
  }
</style>
</head>
<body style="font-family: Arial, sans-serif; font-size: 13px; margin: 0; padding: 0; background-color: #f4f4f4;">
<table align="center" border="0" cellpadding="0" cellspacing="0" width="600" class="full-width" style="margin: 20px auto; background-color: #ffffff;">
  <tr>
    <td align="center" style="padding: 5px 0;">
      <img src="https://fsm.lockene.net/uploads/logo/lockene-black-logo.png" alt="Lockene" width="200" height="50" style="display: block;" />
    </td>
  </tr>
  <tr>
    <td align="center" style="padding: 20px;">
      <p style="font-size: 14px; text-align: left; color: #000000;">Dear ${vendor},</p>
      <p style="font-size: 14px; text-align: left; color: #000000;">${greetMessage} Below are the details of your purchase:</p>
      <p style="font-size: 14px; text-align: left; color: #000000;">
        <strong>${type} No:</strong> ${orderNo}<br/>
        <strong>${type} Date:</strong> ${orderDate}<br/>
        <strong>Shipping Address:</strong> ${shippingAddress}<br/>
      </p>

      <p style="font-size: 14px; text-align: left; color: #000000;">Items ${itemsStatus}:</p>

${
  type === "Purchase Receive"
    ? `
<table border="0" cellpadding="5" cellspacing="0" width="100%" style="border-collapse: collapse; margin: 0;">
  <tr style="background-color: #f4f4f4;">
    <th style="text-align: left; padding: 8px;">Item Name</th>
    <th style="text-align: left; padding: 8px;">Quantity</th>
    <th style="text-align: left; padding: 8px;">Qty Received</th>
  </tr>
  ${req.body.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 8px;">${item.item_id.name}</td>
      <td style="padding: 8px;">${item.quantity}</td>
      <td style="padding: 8px;">${item.qty_received}</td>
    </tr>`
    )
    .join("")}
</table>
`
    : `
<table border="0" cellpadding="5" cellspacing="0" width="100%" style="border-collapse: collapse; margin: 0;">
  <tr style="background-color: #f4f4f4;">
    <th style="text-align: left; padding: 8px;">Item Name</th>
    <th style="text-align: left; padding: 8px;">Quantity</th>
    <th style="text-align: left; padding: 8px;">Price</th>
  </tr>
  ${req.body.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 8px;">${item.item_id.name}</td>
      <td style="padding: 8px;">${item.quantity}</td>
      <td style="padding: 8px;">₹ ${item.price}</td>
    </tr>`
    )
    .join("")}
</table>
`
}

      ${
        note
          ? `<p style="font-size: 13px; text-align: left; color: rgb(242, 5, 5); margin-top: 10px;">*note: All the prices are in USD</p>`
          : ""
      }
      ${
        note
          ? `<p style="font-size: 14px; text-align: left; color: #000000; margin-top: 10px;"><strong>Total Amount:</strong>₹ ${req.body.total}</p>`
          : ""
      }
      <p style="font-size: 14px; text-align: left; color: #000000;"> ${queryMessage} Should you have any questions, feel free to reach out.
        <br/><br/>
        Regards,<br/>
        Lockene,<br/> lockene@gmail.com <br/> 1165234849
      </p>
    </td>
  </tr>
  <tr>
    <td align="center" style="padding: 20px; background-color: #f4f4f4;">
      <p style="font-size: 13px; color: #000000;">© 2025 All rights reserved by <a href="https://lockene.us" style="color: #1a73e8; font-weight: bold;">lockene.us</a></p>
    </td>
  </tr>
</table>
</body>
</html>
`;

    sendMail(email, mailSubject, content);

    return res.status(201).json({
      status: true,
      message: "Mail sent successfully",
    });
  } catch (err) {
    console.error("Error sending mail:", err.stack);
    return res.status(500).json({
      status: false,
      message: "Error sending mail",
      error: err.message,
    });
  }
};

// Delete Purchase Order
const deletePurchaseOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: false,
        message: "Invalid purchase order ID format",
      });
    }

    // Check if purchase order exists
    const purchaseOrder = await InvPo.findById(id);
    if (!purchaseOrder) {
      return res.status(404).json({
        status: false,
        message: "Purchase order not found",
      });
    }

    // Check if purchase order can be deleted (e.g., not if it has been partially received)
    if (purchaseOrder.pending_qty < purchaseOrder.items.reduce((sum, item) => sum + parseInt(item.qty), 0)) {
      return res.status(400).json({
        status: false,
        message: "Cannot delete purchase order with received items. Please cancel instead.",
      });
    }

    // Delete the purchase order
    await InvPo.findByIdAndDelete(id);

    return res.status(200).json({
      status: true,
      message: "Purchase order deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting purchase order:", error);
    return res.status(500).json({
      status: false,
      message: "Error deleting purchase order",
      error: error.message,
    });
  }
};

module.exports = {
  createPurchaseOrder,
  getAllPurchaseOrders,
  getPurchaseOrdersByVendor,
  getPurchaseOrderById,
  updatePurchaseOrder,
  deletePurchaseOrder,
  createPurchaseReceive,
  getAllPurchaseReceives,
  getPurchaseReceiveById,
  createPurchaseBill,
  getAllPurchaseBills,
  updatePurchaseBill,
  getItemQuantities,
  sendMailToClient,
  getCafePurchaseOrders,
};
