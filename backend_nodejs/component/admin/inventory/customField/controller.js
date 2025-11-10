const CustomField = require("./model");

// Create a Custom Field
const createCustomField = async (req, res) => {
  try {
    const { name, cafe, type, code, description } = req.body;

    const newField = await CustomField.create({
      name,
      cafe,
      type,
      code,
      description,
    });

    res.status(201).json({
      status: true,
      message: "Custom field created successfully",
      data: newField,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

// Get All Custom Fields by FSM ID
const getCustomFields = async (req, res) => {
  try {
    const { id } = req.params;

    const fields = await CustomField.find({
      cafe: id,
      is_active: true,
      is_deleted: false,
    });

    res.status(200).json({
      status: true,
      message: "Custom fields fetched successfully",
      results: fields.length,
      data: fields,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

// Get Custom Field by ID
const getCustomFieldById = async (req, res) => {
  try {
    const { id } = req.params;

    const field = await CustomField.findById(id);

    if (!field) {
      return res.status(404).json({
        status: false,
        message: "Custom field not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Custom field fetched successfully",
      data: field,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

// Update Custom Field
const updateCustomField = async (req, res) => {
  try {
    const fieldId = req.params.id;
    const updateData = { ...req.body };

    const field = await CustomField.findByIdAndUpdate(fieldId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!field) {
      return res.status(404).json({
        status: false,
        message: "Custom field not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Custom field updated successfully",
      data: field,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

// Soft Delete Custom Field
const deleteCustomField = async (req, res) => {
  try {
    const field = await CustomField.findByIdAndUpdate(
      req.params.id,
      { is_active: false, is_deleted: true },
      { new: true }
    );

    if (!field) {
      return res.status(404).json({
        status: false,
        message: "Custom field not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Custom field marked as deleted",
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
  createCustomField,
  getCustomFields,
  getCustomFieldById,
  updateCustomField,
  deleteCustomField,
};
