const Tax = require("../../../admin/inventory/tax/model");

const createTax = async (req, res) => {
  try {
    const { tax_name, tax_rate, description, cafe } = req.body;

    const newTax = await Tax.create({
      tax_name,
      tax_rate,
      description,
      cafe,
    });

    res.status(201).json({
      status: true,
      message: "Tax record created successfully",
      data: newTax,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

const getTaxes = async (req, res) => {
  const id = req.saId
  try {
    const taxes = await Tax.find({
      cafe: id,
      is_active: true,
      is_deleted: false,
    });

    return res.status(200).json({
      status: true,
      message: "Superadmin taxes fetched successfully",
      results: taxes.length,
      data: taxes,
    });
  } catch (err) {
    return res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

const getTaxById = async (req, res) => {
  try {
    const { id } = req.params;

    const tax = await Tax.findById(id);

    if (!tax) {
      return res.status(404).json({
        status: false,
        message: "Tax not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Tax details fetched successfully",
      data: tax,
    });
  } catch (err) {
    return res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

const updateTax = async (req, res) => {
  try {
    const taxId = req.params.id;
    const updateData = { ...req.body };

    const tax = await Tax.findByIdAndUpdate(taxId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!tax) {
      return res.status(404).json({
        status: false,
        message: "Tax not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Tax updated successfully",
      data: tax,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

const deleteTax = async (req, res) => {
  try {
    const tax = await Tax.findByIdAndUpdate(
      req.params.id,
      { is_active: false, is_deleted: true },
      { new: true }
    );

    if (!tax) {
      return res.status(404).json({
        status: false,
        message: "Tax not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Tax marked as deleted",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

module.exports = { createTax, getTaxById, getTaxes, updateTax, deleteTax };
