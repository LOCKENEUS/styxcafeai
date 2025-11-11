const Item = require("./model");
const InvSo = require("./model");
const BookItem = require("../purchaseOrder/bookItemModel");


// Sales Order
const createSalesOrder = async (req, res) => {
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
      so_no,
      date: req.body.date || new Date(),
      shipment_date: req.body.shipment_date,
      payment_terms: req.body.payment_terms,
      reference: req.body.reference || "",
      delivery_preference: req.body.delivery_preference || "",
      sales_person: req.body.sales_person || "",
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

    savedSo.items = bookItemIds;
    await savedSo.save();

    return res.status(201).json({
      status: true,
      message: "Sales Order created successfully",
      data: savedSo,
    });
  } catch (err) {
    console.error("Error creating sales order:", err);
    return res.status(500).json({
      status: false,
      message: "Error creating sales order",
      error: err.message,
    });
  }
};
const getSalesOrderList = async (req, res) => {
  try {
    const soList = await InvSo.find({ cafe: req.params.id, type: "SO" })
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
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      status: true,
      message: "SO list fetched successfully",
      results: soList.length,
      data: soList,
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed to fetch so list data",
      message: err.message,
    });
  }
};

const getSalesOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const salesOrder = await InvSo.findById(id)
      .populate("cafe", "name location") // Adjust fields as needed
      .populate("customer_id") // Adjust fields as needed
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
      .populate("tax", "tax_name tax_rate")

    if (!salesOrder) {
      return res.status(404).json({
        status: false,
        message: "Sales Order not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Sales Order details fetched successfully",
      data: salesOrder,
    });
  } catch (err) {
    console.error("Error fetching sales order details:", err);
    return res.status(500).json({
      status: false,
      message: "Error fetching sales order details",
      error: err.message,
    });
  }
};

const updateSalesOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const existingSo = await InvSo.findById(id);
    if (!existingSo) {
      return res.status(404).json({
        status: false,
        message: "Sales Order not found",
      });
    }

    const requiredFields = ["items"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        status: false,
        message: "Required fields must be provided",
        errors: missingFields,
      });
    }

    let documents = existingSo.internal_team_file || [];
    if (req.files && req.files.length > 0) {
      documents = req.files.map((file) =>
        file.path
          .replace(/^.*[\\/](uploads[\\/])/, "uploads/")
          .replace(/\\/g, "/")
      );
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

    const updatedSo = await InvSo.findByIdAndUpdate(
      id,
      {
        cafe: req.body.cafe,
        customer_id: req.body.customer_id,
        shipment_date: req.body.shipment_date,
        payment_terms: req.body.payment_terms,
        reference: req.body.reference,
        delivery_preference: req.body.delivery_preference,
        sales_person: req.body.sales_person,
        description: req.body.description,
        items: req.body.items.map((item) => item.id),
        subtotal: req.body.subtotal,
        discount_value: req.body.discount_value,
        discount_type: req.body.discount_type,
        tax: req.body.tax,
        total: req.body.total,
        adjustment_note: req.body.adjustment_note,
        adjustment_amount:
          req.body.adjustment_amount,
        internal_team_notes:
          req.body.internal_team_notes,
        internal_team_file: req.body.internal_team_file,
        pending_qty,
      },
      { new: true }
    );

    await BookItem.deleteMany({ refer_id: id, type: "SO" });
    const bookItemIds = await Promise.all(
      req.body.items.map(async (product) => {
        const bookItem = new BookItem({
          item_id: product.id,
          type: "SO",
          refer_id: updatedSo._id,
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

    updatedSo.items = bookItemIds;
    await updatedSo.save();

    return res.status(200).json({
      status: true,
      message: "Sales Order updated successfully",
      data: updatedSo,
    });
  } catch (err) {
    console.error("Error updating sales order:", err);
    return res.status(500).json({
      status: false,
      message: "Error updating sales order",
      error: err.message,
    });
  }
};

// Sales Invoice
const createSalesInvoice = async (req, res) => {
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

    // Generate SI Number - only query SI type invoices
    const lastSi = await InvSo.findOne({ type: "SI" }).sort({ createdAt: -1 });
    let nextSiNumber = 1;
    if (lastSi && lastSi.so_no) {
      const lastNumber = parseInt(lastSi.so_no.split("-")[1], 10);
      nextSiNumber = lastNumber + 1;
    }
    
    // Ensure unique SI number with retry mechanism
    let so_no = `SI-${nextSiNumber.toString().padStart(3, "0")}`;
    let existingSi = await InvSo.findOne({ so_no });
    
    // If the generated number already exists, keep incrementing
    while (existingSi) {
      nextSiNumber++;
      so_no = `SI-${nextSiNumber.toString().padStart(3, "0")}`;
      existingSi = await InvSo.findOne({ so_no });
    }

    const newSo = new InvSo({ 
      cafe: req.body.cafe,
      customer_id: req.body.customer_id || null,
      so_no,
      date: req.body.date || new Date(),
      payment_terms: req.body.payment_terms,
      reference: req.body.reference || "",
      delivery_preference: req.body.delivery_preference || "",
      sales_person: req.body.sales_person || "",
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
      type: "SI",
    });

    const savedSo = await newSo.save();

    // Save items in BookItem collection
    const bookItemIds = await Promise.all(
      req.body.items.map(async (product) => {
        const bookItem = new BookItem({
          item_id: product.id,
          type: "SI",
          refer_id: savedSo._id,
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

    savedSo.items = bookItemIds;
    await savedSo.save();

    return res.status(201).json({
      status: true,
      message: "Sales Invoice created successfully",
      data: savedSo,
    });
  } catch (err) {
    console.error("Error creating sales invoice:", err);
    return res.status(500).json({
      status: false,
      message: "Error creating sales invoice",
      error: err.message,
    });
  }
};

const getSalesInvoiceList = async (req, res) => {
  try {
    const siList = await InvSo.find({ cafe: req.params.id, type: "SI" })
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
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      status: true,
      message: "Sales invoice list fetched successfully",
      results: siList.length,
      data: siList,
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed to fetch sales invoice list",
      message: err.message,
    });
  }
};

const getSalesInvoiceDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const salesInvoice = await InvSo.findById(id)
      .populate("cafe", "name location")
      .populate("customer_id")
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
      .populate("tax", "tax_name tax_rate")
      .lean();

    if (!salesInvoice) {
      return res.status(404).json({
        status: false,
        message: "Sales Invoice not found",
      });
    }

    // Fetch payments for this invoice
    const InvPayment = require("./payments/model");
    const payments = await InvPayment.find({ invoice_id: id }).lean();
    
    // Attach payments to the invoice object
    salesInvoice.payments = payments;

    return res.status(200).json({
      status: true,
      message: "Sales Invoice details fetched successfully",
      data: salesInvoice,
    });
  } catch (err) {
    console.error("Error fetching sales invoice details:", err);
    return res.status(500).json({
      status: false,
      message: "Error fetching sales invoice details",
      error: err.message,
    });
  }
};

const updateSalesInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const existingSi = await InvSo.findById(id);
    if (!existingSi) {
      return res.status(404).json({
        status: false,
        message: "Sales Invoice not found",
      });
    }

    const requiredFields = ["items"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        status: false,
        message: "Required fields must be provided",
        errors: missingFields,
      });
    }

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

    const updatedSi = await InvSo.findByIdAndUpdate(
      id,
      {
        cafe: req.body.cafe,
        customer_id: req.body.customer_id,
        payment_terms: req.body.payment_terms,
        reference: req.body.reference,
        delivery_preference: req.body.delivery_preference,
        sales_person: req.body.sales_person,
        description: req.body.description,
        items: req.body.items.map((item) => item.id),
        subtotal: req.body.subtotal,
        discount_value: req.body.discount_value,
        discount_type: req.body.discount_type,
        tax: req.body.tax,
        total: req.body.total,
        adjustment_note: req.body.adjustment_note,
        adjustment_amount:
          req.body.adjustment_amount,
        internal_team_notes:
          req.body.internal_team_notes,
        pending_qty,
      },
      { new: true }
    );

    await BookItem.deleteMany({ refer_id: id, type: "SI" });
    const bookItemIds = await Promise.all(
      req.body.items.map(async (product) => {
        const bookItem = new BookItem({
          item_id: product.id,
          type: "SI",
          refer_id: updatedSi._id,
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

    updatedSi.items = bookItemIds;
    await updatedSi.save();

    return res.status(200).json({
      status: true,
      message: "Sales Invoice updated successfully",
      data: updatedSi,
    });
  } catch (err) {
    console.error("Error updating sales invoice:", err);
    return res.status(500).json({
      status: false,
      message: "Error updating sales invoice",
      error: err.message,
    });
  }
};

module.exports = {
  createSalesOrder,
  getSalesOrderList,
  getSalesOrderDetails,
  updateSalesOrder,
  createSalesInvoice,
  getSalesInvoiceList,
  getSalesInvoiceDetails,
  updateSalesInvoice
};
