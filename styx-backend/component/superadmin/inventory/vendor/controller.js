const Vendor = require("../../../admin/inventory/vendor/model");

const createVendor = async (req, res) => {
  try {
    const vendorData = req.body;

    if (req.body.userType === "superadmin") {
      req.body.cafe = null;
    }

    const existingVendor = await Vendor.findOne({
      cafe: vendorData.cafe,
      emailID: vendorData.emailID,
    });

    if (existingVendor) {
      return res.status(400).json({
        status: false,
        message: "Vendor with the same email already exists",
      });
    }

    if (req.file) {
      vendorData.image = req.file.path
        .replace(/^.*[\\/](uploads[\\/])/, "uploads/")
        .replace(/\\/g, "/");
    }

    const newVendor = await Vendor.create(vendorData);

    res.status(201).json({
      status: true,
      message: "Vendor created successfully",
      data: newVendor,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

const getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find({
      userType: "superadmin",
      is_active: true,
      is_deleted: false,
    });
    return res.status(200).json({
      status: true,
      message: "Vendors fetched successfully",
      results: vendors.length,
      data: vendors,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

const getVendorById = async (req, res) => {
  try {
    const id = req.params.id;

    const vendor = await Vendor.findById(id);

    if (!vendor) {
      return res.status(404).json({
        status: false,
        message: "Vendor not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Vendor details fetched successfully",
      data: vendor,
    });
  } catch (err) {
    return res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

const updateVendor = async (req, res) => {
  try {
    const vendorId = req.params.id;
    const updateData = { ...req.body };

    if (req.file) {
      updateData.image = req.file.path
        .replace(/^.*[\\/](uploads[\\/])/, "uploads/")
        .replace(/\\/g, "/");
    }

    const vendor = await Vendor.findByIdAndUpdate(vendorId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!vendor) {
      return res
        .status(404)
        .json({ status: false, message: "Vendor not found" });
    }

    res.status(200).json({
      status: true,
      message: "Vendor updated successfully",
      data: vendor,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

const deleteVendor = async (req, res) => {
  try {
    // Delete the vendor only when it is not associated with any purchase order

    const vendor = await Vendor.findByIdAndDelete(req.params.id);

    if (!vendor) {
      return res
        .status(404)
        .json({ status: false, message: "Vendor not found" });
    }

    res.status(200).json({
      status: true,
      message: "Vendor deleted successfully",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

module.exports = {
  createVendor,
  getVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
};
