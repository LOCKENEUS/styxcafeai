const InvPo = require("../../../admin/inventory/purchaseOrder/model");
const BookItem = require("../../../admin/inventory/purchaseOrder/bookItemModel");
const Item = require("../../../admin/inventory/item/model");
const Cafe = require("../../cafe/model");
const BillPayment = require("../../../admin/inventory/purchaseOrder/payments/model");

// Sales Order

const createSalesOrder = async (req, res) => {
  try {
    const { cafe, delivery_type } = req.body;
    const requiredFields = ["items"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    req.body.items = JSON.parse(req.body.items);

    if (!cafe || cafe === "" || cafe === null || cafe === undefined) {
      req.body.cafe = null;
    }

    if (delivery_type === "Organization") {
      req.body.customer_id = null;
    }

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
        const existingItem = await Item.findById(item.id);
        if (!existingItem) {
          throw new Error(`Item with ID ${item.id} not found`);
        }
        savedItems.push(existingItem._id);
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
      vendor_id: req.body.vendor_id,
      user_type: req.body.user_type,
      po_no: req.body.po_no,
      delivery_type: req.body.delivery_type,
      customer_id: req.body.customer_id || null,
      delivery_date: req.body.date,
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
      type: "SO",
    });

    const savedPo = await newPo.save();

    const bookItemIds = await Promise.all(
      req.body.items.map(async (product) => {
        const bookItem = new BookItem({
          item_id: product.id,
          type: "SO",
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
      message: "Sales order created successfully",
      data: savedPo,
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
    // Build filter condition
    let queryFilter = {
      $or: [
        { cafe: null, type: "SO" },
        { user_type: "Superadmin", type: "PO" } // Include PO for superadmin
      ]
    };

    const soList = await InvPo.find(queryFilter)
      .populate("cafe")
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

    for (let entry of soList) {
      // Try fetching from Cafe if it's a customer ID
      const cafe = await Cafe.findById(entry.customer_id).lean();
      if (cafe) {
        entry.customer_id = cafe;
      }
    }

    res.status(200).json({
      status: true,
      message: "SO/PO list fetched successfully",
      results: soList.length,
      data: soList,
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed to fetch SO/PO list data",
      message: err.message,
    });
  }
};

const getSalesOrderListByCafe = async (req, res) => {
  const id = req.params.id;
  try {
    const soList = await InvPo.find({ customer_id: id, type: "SO" })
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

    for (let entry of soList) {
      // try fetching from Cafe
      const cafe = await Cafe.findById(entry.customer_id).lean();
      if (cafe) {
        entry.customer_id = cafe;
      }
    }

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
    const salesOrder = await InvPo.findById(id)
      .populate("cafe") // Adjust fields as needed
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

    const cafe = await Cafe.findById(salesOrder.customer_id).lean();
    if (cafe) {
      salesOrder.customer_id = cafe;
    }

    const packages = await InvPo.find({
      refer_id: salesOrder._id,
      type: "PACK",
    })
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

    salesOrder.packages = packages;

    const shipments = await InvPo.find({
      refer_id: salesOrder._id,
      type: "SHIP",
    })
      .populate({
        path: "items",
        populate: [
          {
            path: "item_id",
            model: "Item",
            select: "name description price hsn",
          },
          {
            path: "tax",
            model: "Tax",
            select: "tax_name tax_rate",
          },
        ],
      })
      .populate("tax", "tax_name tax_rate")
      .lean();

    salesOrder.shipments = shipments;

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
    const existingSo = await InvPo.findById(id);
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

    const updatedSo = await InvPo.findByIdAndUpdate(
      id,
      {
        customer_id: req.body.customer_id,
        delivery_date: req.body.date,
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
        adjustment_amount: req.body.adjustment_amount,
        internal_team_notes: req.body.internal_team_notes,
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

// Sales Package Order
const createPackage = async (req, res) => {
  try {
    const { vendor_id, so_id, package_date, description, items } = req.body;
    let qtyToPack = 0;

    // Fetch PO details
    const soDetails = await InvPo.findById(so_id).populate("items");
    if (!soDetails) {
      return res
        .status(404)
        .json({ status: false, message: "Sales order not found." });
    }

    // Calculate quantity to pack
    items.forEach((item) => {
      qtyToPack += parseInt(item.qty_to_pack, 10) || 0;
    });

    if (soDetails.pending_qty < qtyToPack) {
      return res
        .status(400)
        .json({ status: false, message: "Quantity exceeds pending quantity." });
    }

    if (qtyToPack === 0) {
      return res
        .status(400)
        .json({ status: false, message: "Quantity to pack is zero." });
    }

    // ✅ **Find the last PR number safely**
    const lastPack = await InvPo.findOne({ type: "PACK" }).sort({
      createdAt: -1,
    });
    let nextPackNumber = 1;
    if (lastPack && lastPack.po_no) {
      const lastPackNumber = parseInt(lastPack.po_no.split("-")[1], 10);
      nextPackNumber = lastPackNumber + 1;
    }
    const po_no = `PACK-${String(nextPackNumber).padStart(3, "0")}`;

    // ✅ **Ensure unique `po_no` atomically**
    const existingPack = await InvPo.findOne({ po_no });
    if (existingPack) {
      return res.status(400).json({
        status: false,
        message: "Package number already exists, please retry.",
      });
    }

    // ✅ **Create Purchase Receive**
    const updatedPendingQty = qtyToPack;
    const package = new InvPo({
      cafe: soDetails.cafe,
      vendor_id,
      po_no,
      type: "PACK",
      refer_id: so_id,
      delivery_date: package_date,
      description,
      items: [],
      pending_qty: updatedPendingQty,
      customer_id: undefined,
      tax: undefined,
    });

    const savedPack = await package.save();

    // ✅ **Save Book Items & Update Stock**
    const bookItemIds = await Promise.all(
      items.map(async (item) => {
        const bookItem = new BookItem({
          item_id: item.item_id,
          type: "PACK",
          refer_id: savedPack._id,
          hsn: item.hsn || 0,
          quantity: item.quantity,
          price: item.price,
          tax: item.tax || null,
          tax_amt: item.tax_amt || 0,
          total: item.total,
          qty_packed: item.qty_to_pack,
        });
        const savedBookItem = await bookItem.save();

        await BookItem.findByIdAndUpdate(item._id, {
          $inc: { qty_packed: item.qty_to_pack },
        });

        return savedBookItem._id;
      })
    );

    savedPack.items = bookItemIds;
    await savedPack.save();

    return res.status(201).json({
      status: true,
      message: "Package created successfully",
      data: savedPack,
    });
  } catch (error) {
    console.error("Error creating package:", error);
    return res.status(500).json({
      status: false,
      message: "Error creating package",
      error: error.message,
    });
  }
};

const getPackageList = async (req, res) => {
  try {
    const packages = await InvPo.find({ cafe: null, type: "PACK" })
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

    for (let entry of packages) {
      // try fetching from Cafe
      const cafe = await Cafe.findById(entry.vendor_id).lean();
      if (cafe) {
        entry.vendor_id = cafe;
      }
    }

    return res.status(200).json({
      status: true,
      message: "Package list fetched successfully",
      data: packages,
    });
  } catch (error) {
    console.error("Error fetching packages:", error);
    return res.status(500).json({
      status: false,
      message: "Error fetching packages",
      error: error.message,
    });
  }
};

const getPackageDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const package = await InvPo.findById(id)
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
      .populate("refer_id", "delivery_date po_no")
      .lean();

    if (!package) {
      return res.status(404).json({
        status: false,
        message: "Package not found",
      });
    }

    if (package.vendor_id) {
      // try fetching from Cafe
      const cafe = await Cafe.findById(package.vendor_id).lean();
      if (cafe) {
        package.vendor_id = cafe;
      }
    }

    return res.status(200).json({
      status: true,
      message: "Package details fetched successfully",
      data: package,
    });
  } catch (error) {
    console.error("Error fetching package details:", error);
    return res.status(500).json({
      status: false,
      message: "Error fetching package details",
      error: error.message,
    });
  }
};

const createShipment = async (req, res) => {
  try {
    const { client_id, so_id, shipment_date, description, packages } = req.body;
    let qtyToShip = 0;
    let pack_id = [];

    // Fetch PO details
    const soDetails = await InvPo.findById(so_id).populate("items");
    if (!soDetails) {
      return res
        .status(404)
        .json({ status: false, message: "Sales order not found." });
    }

    // Calculate quantity to receive
    packages.forEach((item) => {
      pack_id.push(item.package_id);
      item.items.forEach((bookItem) => {
        qtyToShip += parseInt(bookItem.qty_to_ship, 10) || 0;
      });
    });

    // if (soDetails.pending_qty < qtyToShip) {
    //   return res
    //     .status(400)
    //     .json({ status: false, message: "Quantity exceeds pending quantity." });
    // }

    if (qtyToShip === 0) {
      return res
        .status(400)
        .json({ status: false, message: "Quantity to ship is zero." });
    }

    // ✅ **Find the last PR number safely**
    const lastShip = await InvPo.findOne({ type: "SHIP" }).sort({
      createdAt: -1,
    });
    let nextShipNumber = 1;
    if (lastShip && lastShip.po_no) {
      const lastShipNumber = parseInt(lastShip.po_no.split("-")[1], 10);
      nextShipNumber = lastShipNumber + 1;
    }
    const ship_no = `SHIP-${String(nextShipNumber).padStart(3, "0")}`;

    // ✅ **Ensure unique `po_no` atomically**
    const existingShip = await InvPo.findOne({ ship_no });
    if (existingShip) {
      return res.status(400).json({
        status: false,
        message: "Shipment number already exists, please retry.",
      });
    }

    // ✅ **Create New Shipment**
    const updatedPendingQty = soDetails.pending_qty - qtyToShip;
    const shipment = new InvPo({
      vendor_id: client_id,
      po_no: ship_no,
      type: "SHIP",
      refer_id: so_id,
      delivery_date: shipment_date,
      description,
      items: [],
      pending_qty: updatedPendingQty,
      customer_id: undefined,
      tax: undefined,
      pack_id: pack_id,
    });

    const savedShipment = await shipment.save();

    const bookItemIds = await Promise.all(
      packages.flatMap(async (packageItem) => {
        // Use map instead of forEach to get an array of promises
        const itemPromises = packageItem.items.map(async (cafeItem) => {
          const existingBookItem = await BookItem.findById(cafeItem.item_id);

          if (!existingBookItem) {
            throw new Error(
              `No PO BookItem found for item_id ${cafeItem.item_id}`
            );
          }

          const bookItem = new BookItem({
            item_id: existingBookItem.item_id,
            type: "SHIP",
            refer_id: savedShipment._id,
            hsn: cafeItem.hsn || 0,
            quantity: existingBookItem.quantity || 0,
            price: cafeItem.price || 0,
            tax: cafeItem.tax || null,
            tax_amt: cafeItem.tax_amt || 0,
            total: cafeItem.total || 0,
            qty_shipped: cafeItem.qty_to_ship,
            qty_received: existingBookItem.qty_received || 0,
            qty_packed: existingBookItem.qty_packed || 0,
            qty_returned: existingBookItem.qty_returned || 0,
          });

          const savedBookItem = await bookItem.save();

          // Update the items of package bookitems
          await BookItem.findByIdAndUpdate(cafeItem.item_id, {
            $inc: { qty_shipped: cafeItem.qty_to_ship },
          });

          await Item.findByIdAndUpdate(existingBookItem.item_id, {
            $inc: { stock: -cafeItem.qty_to_ship },
          });

          return savedBookItem._id;
        });

        // Return the array of promises for this package's items
        return Promise.all(itemPromises);
      })
    );

    // Flatten the results since we'll have arrays of arrays
    const flattenedBookItemIds = bookItemIds.flat();

    savedShipment.items = flattenedBookItemIds;
    await savedShipment.save();

    // ✅ **Update PO Pending Quantity**
    // await InvPo.findByIdAndUpdate(po_id, {
    //   pending_qty: updatedPendingQty,
    //   status: updatedPendingQty === 0 ? "Received" : "Partially Received",
    // });

    return res.status(201).json({
      status: true,
      message: "Shipment created successfully",
      data: savedShipment,
    });
  } catch (error) {
    console.error("Error creating shipment:", error);
    return res.status(500).json({
      status: false,
      message: "Error creating shipment",
      error: error.message,
    });
  }
};

const getShipmentList = async (req, res) => {
  try {
    const shipments = await InvPo.find({ cafe: null, type: "SHIP" })
      .populate("customer_id")
      .populate("refer_id")
      .populate("pack_id")
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

    for (let entry of shipments) {
      // try fetching from Cafe
      const cafe = await Cafe.findById(entry.vendor_id).lean();
      if (cafe) {
        entry.vendor_id = cafe;
      }
    }

    return res.status(200).json({
      status: true,
      message: "Shipment list fetched successfully",
      data: shipments,
    });
  } catch (error) {
    console.error("Error fetching shipments:", error);
    return res.status(500).json({
      status: false,
      message: "Error fetching shipments",
      error: error.message,
    });
  }
};

const getShipmentDetails = async (req, res) => {
  const id = req.params.id;
  try {
    const shipment = await InvPo.findById(id)
      .populate("customer_id")
      .populate("refer_id")
      .populate({
        path: "pack_id",
        populate: {
          path: "items", // nested population
          model: "BookItem",
          populate: {
            path: "item_id",
            model: "Item",
          },
        },
      })
      .populate("tax", "tax_name tax_rate")
      .sort({ createdAt: -1 })
      .lean();

    const cafe = await Cafe.findById(shipment.vendor_id).lean();
    if (cafe) {
      shipment.vendor_id = cafe;
    }

    return res.status(200).json({
      status: true,
      message: "Shipment data fetched successfully",
      data: shipment,
    });
  } catch (error) {
    console.error("Error fetching shipment data:", error);
    return res.status(500).json({
      status: false,
      message: "Error fetching shipment data",
      error: error.message,
    });
  }
};

// // Sales Invoice
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

    // Generate SO Number
    const lastSinv = await InvPo.findOne().sort({ createdAt: -1 });
    let nextSinvNumber = 1;
    if (lastSinv) {
      const lastNumber = parseInt(lastSinv.po_no.split("-")[1], 10);
      nextSinvNumber = lastNumber + 1;
    }
    const sinv_no = `SINV-${nextSinvNumber.toString().padStart(3, "0")}`;

    const newSinv = new InvPo({
      cafe: null,
      vendor_id: req.body.client_id,
      customer_id: req.body.customer_id || null,
      po_no: sinv_no,
      delivery_date: req.body.date || new Date(),
      payment_terms: req.body.payment_terms,
      reference: req.body.reference || "",
      delivery_preference: req.body.delivery_preference || "",
      sales_person: req.body.sales_person || "",
      description: req.body.description || "",
      items: req.body.items.map((item) => item.id),
      subtotal: req.body.subtotal || 0,
      discount_value: req.body.discount_value || 0,
      discount_type: req.body.discount_type || "", // so_no
      tax: req.body.tax || [],
      total: req.body.total,
      adjustment_note: req.body.adjustment_note || "",
      adjustment_amount: req.body.adjustment_amount || 0,
      internal_team_notes: req.body.internal_team_notes || "",
      internal_team_file: req.body.internal_team_file || [],
      pending_qty,
      type: "SINV",
      refer_id: req.body.refer_id || null,
    });

    const savedSinv = await newSinv.save();

    // Save items in BookItem collection
    const bookItemIds = await Promise.all(
      req.body.items.map(async (product) => {
        const bookItem = new BookItem({
          item_id: product.id,
          type: "SINV",
          refer_id: savedSinv._id,
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

    savedSinv.items = bookItemIds;
    await savedSinv.save();

    return res.status(201).json({
      status: true,
      message: "Superadmin Sales Invoice created successfully",
      data: savedSinv,
    });
  } catch (err) {
    console.error("Error creating superadmin sales invoice:", err);
    return res.status(500).json({
      status: false,
      message: "Error creating superadmin sales invoice",
      error: err.message,
    });
  }
};

const getSalesInvoiceList = async (req, res) => {
  try {
    const siList = await InvPo.find({ cafe: null, type: "SINV" })
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

    for (let entry of siList) {
      const cafe = await Cafe.findById(entry.customer_id).lean();
      if (cafe) {
        entry.customer_id = cafe;
      }
    }

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
    const salesInvoice = await InvPo.findById(id)
      .populate("cafe", "name location")
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

    const salesOrder = await InvPo.findById(salesInvoice.refer_id);

    if (salesOrder?._id) {
      const packages = await InvPo.find({
        refer_id: salesOrder._id,
        type: "PACK",
      });
      const shipments = await InvPo.find({
        refer_id: salesOrder._id,
        type: "SHIP",
      });
      salesInvoice.packages = packages;
      salesInvoice.shipments = shipments;
    }

    const cafe = await Cafe.findById(salesInvoice.customer_id).lean();
    if (cafe) {
      salesInvoice.customer_id = cafe;
    }

    if (!salesInvoice) {
      return res.status(404).json({
        status: false,
        message: "Sales Invoice not found",
      });
    }

    const payments = await BillPayment.find({
      bill_id: id,
    });

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
    const existingSi = await InvPo.findById(id);
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

    const updatedSi = await InvPo.findByIdAndUpdate(
      id,
      {
        customer_id: req.body.client_id,
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
        adjustment_amount: req.body.adjustment_amount,
        internal_team_notes: req.body.internal_team_notes,
        pending_qty,
      },
      { new: true }
    );

    await BookItem.deleteMany({ refer_id: id, type: "SINV" });
    const bookItemIds = await Promise.all(
      req.body.items.map(async (product) => {
        const bookItem = new BookItem({
          item_id: product.id,
          type: "SINV",
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

// Sales Returns api
const createSalesReturn = async (req, res) => {
  try {
    const { client_id, so_id, return_date, description, shipments } = req.body;
    let qtyToReturn = 0; // packages
    let ship_id = []; // pack_id

    // Fetch PO details
    const soDetails = await InvPo.findById(so_id).populate("items");
    if (!soDetails) {
      return res
        .status(404)
        .json({ status: false, message: "Sales order not found." });
    }

    // Calculate quantity to receive
    shipments.forEach((item) => {
      ship_id.push(item.package_id);
      item.items.forEach((bookItem) => {
        qtyToReturn += parseInt(bookItem.qty_to_return, 10) || 0; // qty_to_ship
      });
    });

    if (soDetails.pending_qty < qtyToReturn) {
      return res
        .status(400)
        .json({ status: false, message: "Quantity exceeds pending quantity." });
    }

    if (qtyToReturn === 0) {
      return res
        .status(400)
        .json({ status: false, message: "Quantity to return is zero." });
    }

    // ✅ **Find the last RTN number safely**
    const lastReturn = await InvPo.findOne({ type: "RTN" }).sort({
      createdAt: -1,
    });
    let nextReturnNumber = 1;
    if (lastReturn && lastReturn.po_no) {
      const lastReturnNumber = parseInt(lastReturn.po_no.split("-")[1], 10);
      nextReturnNumber = lastReturnNumber + 1;
    }
    const return_no = `RTN-${String(nextReturnNumber).padStart(3, "0")}`;

    // ✅ **Ensure unique `po_no` atomically**
    const existingReturn = await InvPo.findOne({ return_no });
    if (existingReturn) {
      return res.status(400).json({
        status: false,
        message: "Return number already exists, please retry.",
      });
    }

    // ✅ **Create New Shipment**
    const updatedPendingQty = soDetails.pending_qty - qtyToReturn;
    const shipmentReturn = new InvPo({
      vendor_id: client_id,
      po_no: return_no,
      type: "RTN",
      refer_id: so_id,
      delivery_date: return_date,
      description,
      items: [],
      pending_qty: updatedPendingQty,
      customer_id: undefined,
      tax: undefined,
      ship_id: ship_id,
    });

    const savedShipmentReturn = await shipmentReturn.save(); // packages

    const bookItemIdsNested = await Promise.all(
      shipments.map(async (item) => {
        const innerIds = await Promise.all(
          item.items.map(async (cafeItem) => {
            const bookItem = new BookItem({
              item_id: cafeItem.item_id,
              type: "RTN",
              refer_id: savedShipmentReturn._id,
              hsn: cafeItem.hsn || 0,
              quantity: cafeItem.quantity || 0,
              price: cafeItem.price || 0,
              tax: cafeItem.tax || null,
              tax_amt: cafeItem.tax_amt || 0,
              total: cafeItem.total || 0,
              qty_returned: cafeItem.qty_to_return,
            });

            const savedBookItem = await bookItem.save();

            // ✅ Update existing item with incremented return quantity
            // await BookItem.findByIdAndUpdate(cafeItem.item_id, {
            //   $inc: { qty_returned: cafeItem.qty_to_return },
            // });

            const updatedBookItem = await BookItem.findOneAndUpdate(
              { _id: cafeItem.item_id, refer_id: item.package_id }, // your conditions
              { $inc: { qty_returned: cafeItem.qty_to_return } } // your update
            );

            return savedBookItem._id;
          })
        );
        return innerIds; // returns array of _ids for each shipment
      })
    );

    // Flatten the result if needed
    const bookItemIds = bookItemIdsNested.flat();
    // ship_no
    savedShipmentReturn.items = bookItemIds;
    await savedShipmentReturn.save();

    return res.status(201).json({
      status: true,
      message: "Shipment return created successfully",
      data: savedShipmentReturn,
    });
  } catch (error) {
    console.error("Error creating shipment return:", error);
    return res.status(500).json({
      status: false,
      message: "Error creating shipment return",
      error: error.message,
    });
  }
};

const getSalesReturnList = async (req, res) => {
  try {
    const returns = await InvPo.find({ cafe: null, type: "RTN" })
      .populate("customer_id")
      .populate("refer_id")
      .populate("pack_id")
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

    for (let entry of returns) {
      // try fetching from Cafe
      const cafe = await Cafe.findById(entry.vendor_id).lean();
      if (cafe) {
        entry.vendor_id = cafe;
      }
    }

    return res.status(200).json({
      status: true,
      message: "Shipment list fetched successfully",
      data: returns,
    });
  } catch (error) {
    console.error("Error fetching shipments:", error);
    return res.status(500).json({
      status: false,
      message: "Error fetching shipments",
      error: error.message,
    });
  }
};

const getSalesReturnDetails = async (req, res) => {
  const id = req.params.id;
  try {
    const salesReturn = await InvPo.findById(id)
      .populate("customer_id")
      .populate("refer_id")
      .populate({
        path: "ship_id",
        populate: {
          path: "items", // nested population
          model: "BookItem",
          populate: {
            path: "item_id",
            model: "Item",
            select: "name description price",
          },
        },
        // populate: {
        //   path: "pack_id",
        //   model: "InvPo",
        //   select: "po_no",
        // },
      })
      .populate("tax", "tax_name tax_rate")
      .sort({ createdAt: -1 })
      .lean();

    const cafe = await Cafe.findById(salesReturn.vendor_id).lean();
    if (cafe) {
      salesReturn.vendor_id = cafe;
    }

    return res.status(200).json({
      status: true,
      message: "Sales return data fetched successfully",
      data: salesReturn,
    });
  } catch (error) {
    console.error("Error fetching sales return data:", error);
    return res.status(500).json({
      status: false,
      message: "Error fetching sales return data",
      error: error.message,
    });
  }
};

module.exports = {
  createSalesOrder,
  getSalesOrderList,
  getSalesOrderListByCafe,
  getSalesOrderDetails,
  updateSalesOrder,
  createPackage,
  getPackageList,
  getPackageDetails,
  createShipment,
  getShipmentList,
  getShipmentDetails,
  createSalesInvoice,
  getSalesInvoiceList,
  getSalesInvoiceDetails,
  updateSalesInvoice,
  createSalesReturn,
  getSalesReturnList,
  getSalesReturnDetails,
};
